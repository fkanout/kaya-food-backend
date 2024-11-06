import { FastifyInstance } from "fastify";
import axios from "axios";
import { Restaurant } from "../helpers/types";
import { OrderStatus, storeOrder } from "../db/orders";
import { getClientByPhoneNumber } from "../db/clients";
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
        try {
            const { data } = await axios(restaurantURL);
            const { whatsappPhoneNumber, restaurantTitle } = data as Restaurant
            const order = await storeOrder({
                restaurantId,
                restaurantTitle: restaurantTitle.ar || restaurantId,
                restaurantWhatsApp: whatsappPhoneNumber,
                clientPhoneNumber: userData.phoneNumber,
                clientAddress: userData.address,
                items,
                restaurantNotes: [],
                orderStatus: OrderStatus.PENDING
            })
            reply.send({
                ...order
            })
        } catch {
            console.error("Error - /orders - Failed fetching restaurant", restaurantId)
            reply.code(404).send()
        }


    })
}