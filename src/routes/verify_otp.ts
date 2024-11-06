import { FastifyInstance, RouteShorthandOptions } from "fastify";
import { saveVerifiedClient } from "../db/clients";
import { validateOTP } from "../otp";

export default async function verifyOTPRoute(server: FastifyInstance) {

    const verifyOTPOpt: RouteShorthandOptions = {
        schema: {
            body: {
                type: "object",
                properties: {
                    phoneNumber: {
                        type: 'string',
                        pattern: '^\\+[0-9]{6,15}$'
                    },
                    otp: { type: 'string' }
                },
                required: ['phoneNumber', 'otp'],

            },
            response: {
                200: {
                    type: 'object',
                    properties: {
                        phoneNumber: { type: 'string' },
                        createdDate: { type: 'string' },
                        jwtToken: { type: 'string' }
                    },
                    required: ['jwtToken'],
                },
                400: {
                    type: 'object',
                    properties: {
                        succuss: { type: 'string' },
                        msg: { type: 'string' }
                    },
                }
            }
        }
    };
    server.post('/verify-otp', verifyOTPOpt, async (request, reply) => {
        const { phoneNumber, otp } = request.body as { phoneNumber: string, otp: string };
        const isValidOTP = validateOTP(phoneNumber, otp)
        if (isValidOTP) {
            console.log("isValidOTP")
            const user = await saveVerifiedClient({ phoneNumber });
            const jwtToken = server.jwt.sign({ phoneNumber });
            reply.send({
                ...user,
                jwtToken
            })

        } else {
            reply.code(404).send({
                success: false,
                msg: "OTP failed"
            })
        }
    });
}