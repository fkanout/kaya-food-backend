
import { FastifyInstance } from "fastify";
import { OFS_REPLIES, RESTAURANT_REPLAY_WHATSAPP, WhatsAppWebhook } from "../types";
import { getOrderById, Item, OrderStatus, updateOrderById } from "../db/orders";
import { getCache, setCache } from "../cache";
import { sendETARequest } from "../whatsapp/sendETA";
import { sendOFS } from "../whatsapp/sendOFS";
import { sendInfo } from "../whatsapp/sendInfo";
import { sendModifyOrder } from "../whatsapp/sendModifyOrder";

// const mock = {
//     "object": "whatsapp_business_account",
//     "entry": [
//         {
//             "id": "487093197812184",
//             "changes": [
//                 {
//                     "value": {
//                         "messaging_product": "whatsapp",
//                         "metadata": {
//                             "display_phone_number": "15551494723",
//                             "phone_number_id": "467098409816102"
//                         },
//                         "contacts": [
//                             {
//                                 "profile": {
//                                     "name": "Faisal Kanout"
//                                 },
//                                 "wa_id": "33750930539"
//                             }
//                         ],
//                         "messages": [
//                             {
//                                 "context": {
//                                     "from": "15551494723",
//                                     "id": "wamid.HBgLMzM3NTA5MzA1MzkVAgARGBJGMjM4NTNFRTVFQTI5M0YxNDEA"
//                                 },
//                                 "from": "33750930539",
//                                 "id": "wamid.HBgLMzM3NTA5MzA1MzkVAgASGBQzQTVEODM3NDhGRDRFQTIwNzg2NAA=",
//                                 "timestamp": "1731148054",
//                                 "type": "button",
//                                 "button": {
//                                     "payload": "قبول الطلب",
//                                     "text": "قبول الطلب"
//                                 }
//                             }
//                         ]
//                     },
//                     "field": "messages"
//                 }
//             ]
//         }
//     ]
// }

export default async function whatsappWebhookRoute(server: FastifyInstance) {
    server.get('/whatsapp_webhook', { preHandler: server.whatsAppHook }, async (request, reply) => {
        const query = request.query as Record<string, string>
        reply.code(200).send(query['hub.challenge'])
    })

    server.post('/whatsapp_webhook', async (request, reply) => {
        const body = request.body as WhatsAppWebhook
        console.log(JSON.stringify(body.entry?.[0]?.changes[0]?.value))
        const messagePayload = body.entry?.[0]?.changes[0]?.value?.messages?.[0].button?.payload
        const messagePayloadById = body.entry?.[0]?.changes[0]?.value?.messages?.[0].interactive?.button_reply?.id
        const messagePayloadByLastReply = body.entry?.[0]?.changes[0]?.value?.messages?.[0].interactive?.list_reply?.id
        const whatsAppMessageId = body.entry?.[0]?.changes[0]?.value?.messages?.[0].id
        const from = body.entry?.[0]?.changes[0]?.value?.messages?.[0].from
        if (!whatsAppMessageId) {
            return reply.code(200).send({ status: "ok" })
        }
        const isMessageProcessed = getCache(whatsAppMessageId)
        if (isMessageProcessed) {
            return reply.code(200).send({ status: "ok" })
        }
        setCache(whatsAppMessageId, true)
        if (messagePayload) {
            console.log(messagePayload);
            const [restaurantReply, orderId] = messagePayload.split(":");

            if (restaurantReply === RESTAURANT_REPLAY_WHATSAPP.ACCEPTED) {
                await updateOrderById({ orderStatus: OrderStatus.CONFIRMED }, orderId)
                await sendETARequest({ whatsAppOrderMessageId: whatsAppMessageId, restaurantPhoneNumber: from, orderId })
            }

            if (restaurantReply === RESTAURANT_REPLAY_WHATSAPP.REJECTED) {
                await updateOrderById({ orderStatus: OrderStatus.CANCELED_RESTAURANT }, orderId)
                const order = await getOrderById(orderId)
                if (order) {
                    console.log("sending sendUnavailableOrNoteIssue")
                    const items = (order?.itemsAfterOFS && order?.itemsAfterOFS?.length > 0 ? order?.itemsAfterOFS : order?.items) || []

                    const isOrderHasNotes = order.items.some(item => item.note && item.note.length > 0);
                    if (isOrderHasNotes) {
                        await sendModifyOrder({ restaurantPhoneNumber: from, orderId, order: items })
                    } else {
                        await sendOFS({ whatsAppOrderMessageId: whatsAppMessageId, restaurantPhoneNumber: from, orderId, items: items, isNoteIssue: false })
                    }
                }
            }
            if (restaurantReply === OFS_REPLIES.NOTE_ISSUE_SELECTED) {
                const order = await getOrderById(orderId)
                if (order) {
                    const items = (order?.itemsAfterOFS && order?.itemsAfterOFS?.length > 0 ? order?.itemsAfterOFS : order?.items) || []
                    await sendOFS({ whatsAppOrderMessageId: whatsAppMessageId, restaurantPhoneNumber: from, orderId, items: items, isNoteIssue: true })
                }
            }
            if (restaurantReply === OFS_REPLIES.NOT_AVAILABLE_SELECTED) {
                const order = await getOrderById(orderId)
                if (order) {
                    const items = (order?.itemsAfterOFS && order?.itemsAfterOFS?.length > 0 ? order?.itemsAfterOFS : order?.items) || []
                    await sendOFS({ whatsAppOrderMessageId: whatsAppMessageId, restaurantPhoneNumber: from, orderId, items: items, isNoteIssue: false })
                }
            }
            if (restaurantReply === OFS_REPLIES.REDO) {
                const order = await getOrderById(orderId)
                if (order) {
                    await updateOrderById({ itemsAfterOFS: [] }, orderId)
                    const isOrderHasNotes = order.items.some(item => item.note && item.note.length > 0);
                    const items = (order?.itemsAfterOFS && order?.itemsAfterOFS?.length > 0 ? order?.itemsAfterOFS : order?.items) || []
                    if (isOrderHasNotes) {
                        await sendModifyOrder({ restaurantPhoneNumber: from, orderId, order: items })
                    } else {
                        await sendOFS({ whatsAppOrderMessageId: whatsAppMessageId, restaurantPhoneNumber: from, orderId, items: items, isNoteIssue: false })
                    }
                }

            }
            if (restaurantReply === OFS_REPLIES.DONE) {
                const order = await getOrderById(orderId)
                if (order) {
                    await updateOrderById({ orderStatus: OrderStatus.PENDING_CLIENT }, orderId)
                    await sendInfo({ whatsAppOrderMessageId: whatsAppMessageId, restaurantPhoneNumber: from, body: "تم ارسال الطلب المعدّل و بإنتظار تأكيد الزبون" })
                }

                console.log(restaurantReply, orderId)
            }

            console.log("messagePayloadById", messagePayloadById)
        }
        if (messagePayloadById) {
            if (messagePayloadById.startsWith("ETA")) {
                const [, eta, orderId] = messagePayloadById.split("_")
                console.log(eta, orderId)
                switch (eta) {
                    case RESTAURANT_REPLAY_WHATSAPP[1800]:
                    case RESTAURANT_REPLAY_WHATSAPP[2700]:
                    case RESTAURANT_REPLAY_WHATSAPP[3600]: {
                        await updateOrderById({ eta }, orderId)
                        console.log(messagePayloadById, orderId)
                        break;
                    }
                }
            }
        }

        if (messagePayloadByLastReply) {
            console.log("messagePayloadByLastReply", messagePayloadByLastReply)
            if (messagePayloadByLastReply.startsWith("OFS")) {
                const [, orderId, itemId, reason] = messagePayloadByLastReply.split("_")
                const order = await getOrderById(orderId)
                const items = (order?.itemsAfterOFS && order?.itemsAfterOFS?.length > 0 ? order?.itemsAfterOFS : order?.items) || []
                let itemsAfterOFS: Item[] = [];
                if (reason === OFS_REPLIES.NOTE_ISSUE) {
                    itemsAfterOFS = items.map(item => {
                        if (item.id === itemId) {
                            return { ...item, note: "" };
                        }
                        return item;
                    });
                } else if (reason === OFS_REPLIES.NOT_AVAILABLE) {
                    itemsAfterOFS = items.filter(item => item.id !== itemId);
                }
                const updatedOrder = await updateOrderById({ itemsAfterOFS }, orderId)
                await sendModifyOrder({ restaurantPhoneNumber: from, orderId, order: updatedOrder?.itemsAfterOFS || [] })
            }
        }

        reply.code(200).send({ status: "ok" })

    })
}
