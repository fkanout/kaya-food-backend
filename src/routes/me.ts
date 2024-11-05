import { FastifyInstance } from "fastify";
import { saveOrReturnVerifiedUser } from "../db/users";

export default async function meRoute(server: FastifyInstance) {
    server.post('/me', { preHandler: server.authenticate, }, async (request, reply) => {

        const user = await saveOrReturnVerifiedUser({ phoneNumber: request.user.phoneNumber });
        reply.send({
            user
        })
    })
}