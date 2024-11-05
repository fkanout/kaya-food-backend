import { FastifyInstance, RouteShorthandOptions } from 'fastify';
import { generateOTP, storePhoneNumberWithOTP } from '../otp';



export default async function loginRoute(server: FastifyInstance) {
    const loginOpt: RouteShorthandOptions = {
        schema: {
            body: {
                type: "object",
                properties: {
                    phoneNumber: {
                        type: 'string',
                        pattern: '^\\+[0-9]{6,15}$'
                    }
                },
                required: ['phoneNumber'],

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
                }
            }
        }
    };

    server.post('/login', loginOpt, async (request, reply) => {
        const { phoneNumber } = request.body as { phoneNumber: string };
        const otp = generateOTP();
        const otpInitiated = storePhoneNumberWithOTP(phoneNumber, otp)
        if (otpInitiated) {
            return reply.send({ success: true });
        } else {
            return reply.code(400).send({ success: false });
        }
    });
}