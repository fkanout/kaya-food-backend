import { FastifyInstance } from "fastify";
import { getClientByPhoneNumber } from "../db/clients";

export default async function whatsappWebhookRoute(server: FastifyInstance) {
    server.post('/whatsapp_webhook', { preHandler: server.authenticate, }, async (request, reply) => {
        const user = await getClientByPhoneNumber(request.user.phoneNumber);
        reply.send({
            ...user
        })
    })
}