import Fastify, { FastifyInstance, FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify'
import fastifyJWT from '@fastify/jwt';
import login from './routes/login'
import verifyOTP from './routes/verify_otp'
import me from './routes/me';
import ordersRoute from './routes/orders';
import clientsRoute from './routes/client';
if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not set.");
}
const server: FastifyInstance = Fastify({
    logger: {
        level: "error",
        transport: {
            target: 'pino-pretty',
            options: {
                colorize: true,
                colorizeObjects: true,
                translateTime: 'SYS:HH:MM:ss.l', // Format time, e.g., 14:30:23.123
            }
        }
    }
})

interface UserPayload {
    phoneNumber: string,
    address: {
        residence: string;
        block: string;
        flat: string;
    }
}
// Extend Fastify types explicitly
declare module '@fastify/jwt' {
    interface FastifyJWT {
        payload: {
            phoneNumber: string,
        };
        user: UserPayload;
    }
}
declare module 'fastify' {
    interface FastifyInstance {
        authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    }
}
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
server.register(authDecorator);

server.register(fastifyJWT, {
    secret: process.env.JWT_SECRET,
});

server.register(login, { prefix: '/v1' })
server.register(verifyOTP, { prefix: '/v1' })

//Protected JWT
server.register(me, { prefix: '/v1' })
server.register(ordersRoute, { prefix: '/v1' })
server.register(clientsRoute, { prefix: '/v1' })

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

export const startServer = async () => {
    server.listen({ port: PORT, host: '0.0.0.0' }, (err, address) => {
        if (err) {
            server.log.error(err);
            process.exit(1);
        }
        server.log.info(`Server listening at ${address}`);
    });
}

