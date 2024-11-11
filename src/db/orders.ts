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
    whatsAppOrderMessageId?: string
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
            whatsAppOrderMessageId: order.whatsAppOrderMessageId || ""
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
    whatsAppOrderMessageId?: string;
}
export async function updateOrderById(order: UpdateOrder, orderId: string) {
    const orderRef = db.collection("orders").doc(orderId);
    try {
        await orderRef.update(order as { [x: string]: unknown });
        console.log("Order updated successfully.");
        const orderSnapshot = await orderRef.get();
        return { ...orderSnapshot.data(), id: orderSnapshot.id };
    } catch (error) {
        console.error("Error updating order:", error);
    }
}

export async function updateOrderByWhatsAppChatId(order: UpdateOrder, whatsAppOrderMessageId: string) {
    const ordersRef = db.collection(DB_COLLECTIONS.ORDERS);
    const querySnapshot = await ordersRef.where('whatsAppOrderMessageId', '==', whatsAppOrderMessageId).limit(1).get();
    if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref;
        const updateData = {
            ...querySnapshot.docs[0].data(),
            ...order
        }
        await docRef.set(updateData);
        const updateProfileRef = await docRef.get();
        return updateProfileRef.data();
    } else {
        throw (`Error order with whatsAppOrderMessageId == ${whatsAppOrderMessageId} doesn't exists`)
    }
}