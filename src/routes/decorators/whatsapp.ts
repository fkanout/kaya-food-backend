import { FastifyInstance, FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";

export const registerWhatsappHookDecorator = (server: FastifyInstance) => {
    const authDecorator: FastifyPluginAsync = async () => {
        server.decorate('whatsAppHook', async (request: FastifyRequest, reply: FastifyReply) => {
            try {
                const query = request.query as Record<string, string>;
                if (query['hub.verify_token'] !== process.env.WHATSAPP_HOOK_VERIFY_TOKEN || "") {
                    throw ("VERIFY TOKEN is not correct")
                }
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error: unknown) {
                reply.status(401).send({ error: 'Unauthorized' });
            }
        });
    };
    return authDecorator;
}
