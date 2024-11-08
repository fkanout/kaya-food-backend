import { FastifyInstance, FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";

export const registerAuthDecorator = (server: FastifyInstance) => {
    const authDecorator: FastifyPluginAsync = async () => {
        server.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
            try {
                await request.jwtVerify();
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error: unknown) {
                reply.status(401).send({ error: 'Unauthorized' });
            }
        });
    };
    return authDecorator;
}
