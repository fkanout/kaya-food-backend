import { DB_COLLECTIONS } from "./constants";


import { db } from "./index"

export const OrderStatus = {
    PENDING_RESTAURANT: 'pending_restaurant',
    PENDING_CLIENT: 'pending_client',
    CANCELED_CLIENT: 'canceled_client',
    CANCELED_RESTAURANT: 'canceled_restaurant',
    CONFIRMED: 'confirmed',
    DELAYED: 'delayed',
    ON_DELIVERY: 'on_delivery',
    DELIVERED: 'delivered',
} as const
export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export interface Item {
    id: string
    name: string;
    quantity: number;
    note: string;
    price: number;
}
interface Order {
    id?: string,
    restaurantId: string;
    restaurantTitle: string;
    restaurantWhatsApp: string;
    clientPhoneNumber: string;
    clientAddress: {
        residence: string;
        block: string;
        flat: string;
    };
    items: Item[];
    totalPrice: number;
    orderStatus: OrderStatus;
    restaurantNotes?: string[];
    clientNotes?: string[];
    whatsAppOrderMessageId?: string;
    itemsAfterOFS?: Item[];
    eta?: string
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
            clientAddress: order.clientAddress,
            items: order.items,
            orderStatus: order.orderStatus,
            createdDate: new Date().getTime(),
            totalPrice: order.totalPrice,
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
    eta?: string,
    itemsAfterOFS?: Item[]
}

export async function getOrderById(orderId: string): Promise<Order | null> {
    try {
        const orderRef = db.collection("orders").doc(orderId);
        const orderDoc = await orderRef.get();

        if (orderDoc.exists) {
            const orderData = orderDoc.data();
            console.log("Order data:", orderData);
            return orderData as Order;
        } else {
            console.log("No order found with this ID.");
            return null;
        }
    } catch (error) {
        console.error("Error fetching order:", error);
        throw error;
    }
}
export async function updateOrderById(order: UpdateOrder, orderId: string) {
    const orderRef = db.collection("orders").doc(orderId);
    try {
        await orderRef.update(order as { [x: string]: unknown });
        console.log("Order updated successfully.");
        const orderSnapshot = await orderRef.get();
        return { ...orderSnapshot.data(), id: orderSnapshot.id } as unknown as Order;
    } catch (error) {
        console.error("Error updating order:", error);
    }
}
export async function getOrdersByUserPhoneNumber(clientPhoneNumber: string, orderStatus?: OrderStatus): Promise<Order[]> {
    try {
        let query = db.collection('orders')
            .where('clientPhoneNumber', '==', clientPhoneNumber)
            .orderBy('createdDate', 'desc');

        if (orderStatus) {
            query = query.where('orderStatus', '==', orderStatus);
        }
        const querySnapshot = await query.get();

        const orders = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                restaurantId: data.restaurantId,
                restaurantTitle: data.restaurantTitle,
                restaurantWhatsApp: data.restaurantWhatsApp,
                clientPhoneNumber: data.clientPhoneNumber,
                clientAddress: data.clientAddress,
                items: data.items,
                orderStatus: data.orderStatus,
                restaurantNotes: data.restaurantNotes,
                clientNotes: data.clientNotes,
                totalPrice: data.totalPrice,
                whatsAppOrderMessageId: data.whatsAppOrderMessageId,
                itemsAfterOFS: data.itemsAfterOFS,
                eta: data.eta,
            } as Order;
        });
        return orders;
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw new Error('Failed to fetch orders');
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