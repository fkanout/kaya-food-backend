import axios from "axios";
import { FastifyInstance } from "fastify";
export default async function whatsappWebhookRoute(server: FastifyInstance) {
    server.get('/whatsapp_webhook', { preHandler: server.whatsAppHook }, async (request, reply) => {
        const query = request.query as Record<string, string>
        console.log(request.body)
        reply.code(200).send(query['hub.challenge'])
    })

    server.post('/whatsapp_webhook', async (request, reply) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const body = request.body as Record<string, any>
        console.log(request.body)
        const business_phone_number_id =
            body.entry?.[0].changes?.[0].value?.metadata?.phone_number_id;
        const message = body.entry?.[0]?.changes[0]?.value?.messages?.[0];

        await axios({
            method: "POST",
            url: `https://graph.facebook.com/v20.0/${business_phone_number_id}/messages`,
            headers: {
                Authorization: `Bearer ${process.env.GRAPH_API_TOKEN}`,
            },
            data: {
                messaging_product: "whatsapp",
                status: "read",
                message_id: message.id,
            },
        });
        reply.code(200);
    })


}