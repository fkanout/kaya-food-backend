import { FastifyInstance } from "fastify";
import axios from "axios";
import { Restaurant } from "../helpers/types";
import { OrderStatus, storeOrder, updateOrderById } from "../db/orders";
import { getClientByPhoneNumber } from "../db/clients";
import { sendWhatsappOrder } from "../whatsapp/sendOrder";
import { hashString } from "../helpers/hash";

interface Item {
    name: string;
    quantity: number;
    note: string;
}
export interface Order {
    restaurantId: string;
    items: Item[];
}


export default async function ordersRoute(server: FastifyInstance) {
    const schema = {
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
                            name: { type: 'string' },
                            quantity: { type: 'integer', minimum: 1 },
                            note: { type: 'string' }

                        },
                        required: ['name', 'quantity']
                    },
                    minItems: 1
                },
            },
            required: ['restaurantId', 'items']
        },
    }
    server.post('/orders', { preHandler: server.authenticate, schema }, async (request, reply) => {
        const { restaurantId, items } = request.body as Order
        const user = request.user;
        const userData = await getClientByPhoneNumber(user.phoneNumber);
        const restaurantURL = `https://fkanout.github.io/kaya-food/restaurants/${restaurantId}.json`
        let orderId
        try {
            const { data } = await axios(restaurantURL);
            const { whatsappPhoneNumber, restaurantTitle } = data as Restaurant
            const hashedItems = items.map(item => {
                return {
                    id: hashString(item.name, item.note, item.note),
                    name: item.name,
                    quantity: item.quantity,
                    note: item.note
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
                orderStatus: OrderStatus.PENDING
            })
            if (order?.id) {
                orderId = order.id
                const whatsAppOrderMessageId = await sendWhatsappOrder({
                    restaurantPhoneNumber: whatsappPhoneNumber,
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