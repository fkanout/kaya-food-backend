
import { FastifyInstance } from "fastify";
import { RESTAURANT_REPLAY_WHATSAPP, WhatsAppWebhook } from "../types";
import { OrderStatus, updateOrderById } from "../db/orders";
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
        const messagePayload = body.entry?.[0]?.changes[0]?.value?.messages?.[0].button.payload
        const messagePayloadById = body.entry?.[0]?.changes[0]?.value?.messages?.[0].button.id
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
            if (messagePayloadById) {
                const [restaurantReply, orderId] = messagePayload.split("_");

                switch (restaurantReply) {
                    case RESTAURANT_REPLAY_WHATSAPP[1200]:
                    case RESTAURANT_REPLAY_WHATSAPP[1800]:
                    case RESTAURANT_REPLAY_WHATSAPP[2400]:
                    case RESTAURANT_REPLAY_WHATSAPP[3000]:
                    case RESTAURANT_REPLAY_WHATSAPP[3600]:
                    case RESTAURANT_REPLAY_WHATSAPP[4200]:
                    case RESTAURANT_REPLAY_WHATSAPP[5400]:
                    case RESTAURANT_REPLAY_WHATSAPP[7200]: {
                        const [, eta,] = restaurantReply.split("_")
                        await updateOrderById({ eta }, orderId)
                        break;
                    }
                }
            }
            console.log(restaurantReply, orderId)

        }


        reply.code(200).send({ status: "ok" })
    })


}