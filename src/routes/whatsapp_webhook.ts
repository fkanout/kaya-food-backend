import { FastifyInstance } from "fastify";
export default async function whatsappWebhookRoute(server: FastifyInstance) {
    server.get('/whatsapp_webhook', { preHandler: server.whatsAppHook }, async (request, reply) => {
        reply.send({
            query: request.query
        })
    })
}