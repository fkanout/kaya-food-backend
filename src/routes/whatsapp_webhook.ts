import { FastifyInstance } from "fastify";
export default async function whatsappWebhookRoute(server: FastifyInstance) {
    server.get('/whatsapp_webhook', { preHandler: server.whatsAppHook }, async (request, reply) => {
        const query = request.query as Record<string, string>
        reply.send(query['hub.challenge'])
    })
}