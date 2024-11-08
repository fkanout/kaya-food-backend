import { FastifyInstance, FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";

export const registerWhatsappHookDecorator = (server: FastifyInstance) => {
    const authDecorator: FastifyPluginAsync = async () => {
        server.decorate('whatsAppHook', async (request: FastifyRequest, reply: FastifyReply) => {
            try {
                const authorization = request.query;
                console.log(authorization)
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error: unknown) {
                reply.status(401).send({ error: 'Unauthorized' });
            }
        });
    };
    return authDecorator;
}
