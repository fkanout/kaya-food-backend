import { FastifyInstance } from "fastify";
export default async function whatsappWebhookRoute(server: FastifyInstance) {
    server.get('/whatsapp_webhook', { preHandler: server.whatsAppHook }, async (request, reply) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const query = request.query as Record<string, any>
        reply.send(query.hub.challenge)
    })
}