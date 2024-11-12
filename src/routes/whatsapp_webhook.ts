
import { FastifyInstance } from "fastify";
import { OFS_REPLIES, RESTAURANT_REPLAY_WHATSAPP, WhatsAppWebhook } from "../types";
import { getOrderById, OrderStatus, updateOrderById } from "../db/orders";
import { getCache, setCache } from "../cache";
import { sendETARequest } from "../whatsapp/sendETA";
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
            }
            console.log(restaurantReply, orderId)
        }

        console.log("messagePayloadById", messagePayloadById)

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

            } else if (messagePayloadById.startsWith("OFS")) {
                const [, orderId, itemId, reason] = messagePayloadById.split("_")
                if (reason === OFS_REPLIES.NOTE_ISSUE) {
                    const order = await getOrderById(orderId)
                    if (order) {
                        const itemsAfterOFS = order.items.map(item => {
                            if (item.id === itemId) {
                                return { ...item, note: "" }; // Empty the note if name is "faisal"
                            }
                            return item;
                        });
                        await updateOrderById({ itemsAfterOFS }, orderId)
                    }
                } else if (reason === OFS_REPLIES.NOT_AVAILABLE) {
                    const order = await getOrderById(orderId)
                    if (order) {
                        const itemsAfterOFS = order.items.filter(item => item.id !== itemId);
                        await updateOrderById({ itemsAfterOFS }, orderId)
                    }
                }
            }
        }
        reply.code(200).send({ status: "ok" })


    })
}