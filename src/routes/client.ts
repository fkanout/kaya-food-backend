import { FastifyInstance } from "fastify";
import { updateClientProfile } from "../db/clients";
interface ClientProfile {
    firstName: string;
    lastName: string;
    preferences: string[]; //TODO: define categories
    address: {
        residence: string;
        block: string;
        flat: string;
    },
    birthday: string;
}
const schema = {
    body: {
        type: "object",
        properties: {
            firstName: {
                type: 'string',
            },
            lastName: {
                type: 'string',
            },
            preferences: {
                type: 'array',
                items: {
                    type: 'string'
                }
            },
            birthday: {
                type: 'string',
            },
            address: {
                type: 'object',
                properties: {
                    residence: { type: 'string' },
                    block: { type: 'string' },
                    flat: { type: 'string' }
                },
            }
        },
    },
    response: {
        200: {
            type: 'object',
            properties: {
                success: {
                    type: 'boolean'
                },
            },
            required: ['success'],
        },
        400: {
            type: 'object',
            properties: {
                success: {
                    type: 'boolean'
                },
            },
            required: ['success'],
        }
    }
}



export default async function clientsRoute(server: FastifyInstance) {
    server.post('/clients', { preHandler: server.authenticate, schema }, async (request, reply) => {
        const clientProfile = request.body as ClientProfile
        const { phoneNumber } = request.user
        const updated = await updateClientProfile(clientProfile, phoneNumber)
        if (updated) {
            reply.send({
                success: true
            })
        } else {
            reply.code(400).send({
                success: false
            })
        }
    })
}