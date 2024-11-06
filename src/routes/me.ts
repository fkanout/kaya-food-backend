import { FastifyInstance } from "fastify";
import { getClientByPhoneNumber } from "../db/clients";

export default async function meRoute(server: FastifyInstance) {
    server.post('/me', { preHandler: server.authenticate, }, async (request, reply) => {
        const user = await getClientByPhoneNumber(request.user.phoneNumber);
        reply.send({
            ...user
        })
    })
}