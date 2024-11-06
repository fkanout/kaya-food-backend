import { FastifyInstance } from "fastify";
import { saveVerifiedClient } from "../db/clients";

export default async function meRoute(server: FastifyInstance) {
    server.post('/me', { preHandler: server.authenticate, }, async (request, reply) => {

        const user = await saveVerifiedClient({ phoneNumber: request.user.phoneNumber });
        reply.send({
            user
        })
    })
}