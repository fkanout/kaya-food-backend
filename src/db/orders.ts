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

export interface Item {
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
    restaurantNotes?: string[];
    clientNotes?: string[];
    whatsAppChatId?: string;
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
            createdDate: new Date().getTime(),
            whatsAppChatId: order.whatsAppChatId || ""
        });
        const newUserSnapshot = await newOrderRef.get();
        return { ...newUserSnapshot.data(), id: newOrderRef.id };
    } catch (error) {
        console.error(error)
    }
}
interface UpdateOrder {
    items?: Item[];
    orderStatus?: OrderStatus;
    restaurantNotes?: string[];
    clientNotes?: string[]
    whatsAppChatId?: string;
}
export async function updateOrder(order: UpdateOrder, orderId: string) {
    const orderRef = db.collection("orders").doc(orderId);
    try {
        await orderRef.update(order as { [x: string]: unknown });
        console.log("Order updated successfully.");
    } catch (error) {
        console.error("Error updating order:", error);
    }
}
