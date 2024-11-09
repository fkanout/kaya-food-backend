
import { FastifyInstance } from "fastify";
import { WhatsAppWebhook } from "../types";
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

        // const business_phone_number_id =
        //     body.entry?.[0].changes?.[0].value?.metadata?.phone_number_id;
        const buttonPayload = body.entry?.[0]?.changes[0]?.value?.messages?.[0].button.payload;
        console.log(body.entry[0])
        if (buttonPayload === "قبول الطلب") {
            console.log("order accepted")
        }
        // await axios({
        //     method: "POST",
        //     url: `https://graph.facebook.com/v20.0/${business_phone_number_id}/messages`,
        //     headers: {
        //         Authorization: `Bearer ${process.env.GRAPH_API_TOKEN}`,
        //     },
        //     data: {
        //         messaging_product: "whatsapp",
        //         status: "read",
        //         message_id: message.id,
        //     },
        // });
        reply.code(200);
    })


}