import { DB_COLLECTIONS } from "./constants";
import { db } from "./index"
export const OrderStatus = {
    PENDING: 'pending',
    CANCELED_CLIENT: 'canceled_client',
    CANCELED_RESTAURANT: 'canceled_restaurant',
    CONFIRMED: 'received',
    DELAYED: 'delayed',
    OUT_OF_STOCK: 'out_of_stock',
    ON_DELIVERY: 'on_delivery',
    DONE: 'done'
} as const
export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

interface Item {
    name: string;
    quantity: number;
    note: string;
}
interface Order {
    restaurantId: string;
    restaurantTitle: string;
    restaurantWhatsApp: string;
    clientPhoneNumber: string;
    clientAddress: {
        residence: string;
        block: string;
        flat: string;
    }
    items: Item[];
    orderStatus: OrderStatus;
    restaurantNotes: string[];
}

export async function storeOrder(order: Order) {
    try {
        const ordersRef = db.collection(DB_COLLECTIONS.ORDERS);
        const newOrderRef = ordersRef.doc();
        await newOrderRef.set({
            restaurantId: order.restaurantId,
            restaurantTitle: order.restaurantTitle,
            restaurantWhatsApp: order.restaurantWhatsApp,
            clientPhoneNumber: order.clientPhoneNumber,
            address: order.clientAddress,
            items: order.items,
            orderStatus: order.orderStatus,
            createdDate: new Date().getTime()
        });
        const newUserSnapshot = await newOrderRef.get();
        return newUserSnapshot.data();
    } catch (error) {
        console.error(error)
    }


}
