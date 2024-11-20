import { FastifyInstance } from "fastify";
import axios from "axios";
import { Restaurant } from "../helpers/types";
import { getOrdersByUserPhoneNumber, OrderStatus, storeOrder, updateOrderById } from "../db/orders";
import { getClientByPhoneNumber } from "../db/clients";
import { sendWhatsappOrder } from "../whatsapp/sendOrder";


interface Item {
    id: string;
    name: string;
    quantity: number;
    note: string;
    price: number;
}
export interface Order {
    restaurantId: string;
    items: Item[];
}


export default async function ordersRoute(server: FastifyInstance) {
    const schemaPOST = {
        querystring: {
            type: "object",
            properties: {
                dev_phone_number: {
                    type: 'string',
                },
            },
        },
        body: {
            type: "object",
            properties: {
                restaurantId: {
                    type: 'string',
                },
                items: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            name: { type: 'string' },
                            quantity: { type: 'integer', minimum: 1 },
                            note: { type: 'string' },
                            price: { type: 'integer' }

                        },
                        required: ['name', 'quantity']
                    },
                    minItems: 1
                },
            },
            required: ['restaurantId', 'items']
        },
    }
    const schemaGET = {
        querystring: {
            type: "object",
            properties: {
                status: {
                    type: 'string',
                },
            },
        }
    }
    server.get('/orders', { preHandler: server.authenticate, schema: schemaGET }, async (request, reply) => {
        const user = request.user;
        const { status } = request.query as Record<string, string | undefined>
        const orders = await getOrdersByUserPhoneNumber(user.phoneNumber, status as OrderStatus)
        reply.send(orders)
    });
    server.post('/orders', { preHandler: server.authenticate, schema: schemaPOST }, async (request, reply) => {
        const { restaurantId, items } = request.body as Order
        const { dev_phone_number } = request.query as Record<string, string | undefined>

        const user = request.user;
        const userData = await getClientByPhoneNumber(user.phoneNumber);
        const restaurantURL = `https://fkanout.github.io/kaya-food/restaurants/${restaurantId}.json`
        let orderId
        try {
            const { data } = await axios(restaurantURL);
            const { whatsappPhoneNumber, restaurantTitle } = data as Restaurant
            const hashedItems = items.map(item => {
                return {
                    id: item.id,
                    name: item.name,
                    quantity: item.quantity,
                    note: item.note || "",
                    price: item.price
                }
            });
            const order = await storeOrder({
                restaurantId,
                restaurantTitle: restaurantTitle.ar || restaurantId,
                restaurantWhatsApp: whatsappPhoneNumber,
                clientPhoneNumber: user.phoneNumber,
                clientAddress: userData.address,
                items: hashedItems,
                restaurantNotes: [],
                orderStatus: OrderStatus.PENDING_RESTAURANT
            })
            if (order?.id) {
                orderId = order.id
                const whatsAppOrderMessageId = await sendWhatsappOrder({
                    // eslint-disable-next-line no-constant-binary-expression
                    restaurantPhoneNumber: dev_phone_number || '33750930539' || whatsappPhoneNumber,
                    orderId: order?.id || "orderId",
                    clientFirstName: userData.firstName,
                    clientLastName: userData.lastName,
                    clientPhoneNumber: user.phoneNumber,
                    clientResidence: userData.address.residence,
                    clientBlock: userData.address.block,
                    clientFlat: userData.address.flat,
                    order: hashedItems
                })
                if (whatsAppOrderMessageId) {
                    // await sendOFS({ whatsAppOrderMessageId, orderId, items: hashedItems, restaurantPhoneNumber: whatsappPhoneNumber })

                    const orderUpdated = await updateOrderById({ whatsAppOrderMessageId }, orderId)
                    return reply.send({
                        ...orderUpdated
                    })
                } else {
                    reply.code(500).send({ success: false, msg: "couldn't send the order to the restaurant" })
                }
            }

        } catch {
            console.error("Error - /orders - Failed send order to the restaurant: ", restaurantId, " orderId: ", orderId)
            reply.code(404).send()
        }


    })
}