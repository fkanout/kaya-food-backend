import { FastifyInstance } from "fastify";
export default async function whatsappWebhookRoute(server: FastifyInstance) {
    server.post('/whatsapp_webhook', { preHandler: server.whatsAppHook }, async (request, reply) => {
        const query = request.query as Record<string, string>
        console.log(request.body)
        reply.code(200).send(query['hub.challenge'])
    })

    server.get('/whatsapp_webhook', { preHandler: server.whatsAppHook }, async (request, reply) => {
        const query = request.query as Record<string, string>
        console.log(request.body)
        reply.code(200).send(query['hub.challenge'])
    })
}