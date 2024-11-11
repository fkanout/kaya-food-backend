import axios from "axios"
import { Item } from "../db/orders"
import { RESTAURANT_REPLAY_WHATSAPP, WhatsAppMessageResponse } from "../types"
export const sendWhatsappOrder = async ({
    // restaurantPhoneNumber,
    orderId,
    clientFirstName,
    clientLastName,
    clientPhoneNumber,
    clientResidence,
    clientBlock,
    clientFlat,
    order
}: {
    restaurantPhoneNumber: string,
    orderId: string,
    clientFirstName: string,
    clientLastName: string,
    clientPhoneNumber: string,
    clientResidence: string,
    clientBlock: string,
    clientFlat: string,
    order: Item[]
}): Promise<string | undefined> => {
    const location = {
        "latitude": 41.1217921,
        "longitude": 28.7779856,
        "name": `${clientResidence} - ${clientBlock} - ${clientFlat}`,
        "address": `${clientResidence} - ${clientBlock} - ${clientFlat}`,
    }
    const newOrderReceivedTemplate = {
        "messaging_product": "whatsapp",
        "to": "33750930539",//TODO: restaurantPhoneNumber
        "type": "template",
        "template": {
            "name": "new_order_received",
            "language": {
                "code": "ar"
            },
            "components": [
                {
                    "type": "header",
                    "parameters": [
                        {
                            "type": "location",
                            location
                        }
                    ]
                },
                {
                    "type": "body",
                    "parameters": [
                        {
                            "type": "text",
                            "text": orderId
                        },
                        {
                            "type": "text",
                            "text": `${clientFirstName} ${clientLastName} \\n ${clientPhoneNumber}`
                        },
                        {
                            "type": "text",
                            "text": order.map((item) => `⚪️ ${item.name} 𝘅 ${item.quantity} \\n ${item.note}\\n\\n`).join("")
                        }
                    ]
                },
                {
                    "type": "button",
                    "sub_type": "quick_reply",
                    "index": "0",
                    "parameters": [
                        {
                            "type": "payload",
                            "payload": `${RESTAURANT_REPLAY_WHATSAPP.ACCEPTED}:${orderId}`
                        }
                    ]
                },
                {
                    "type": "button",
                    "sub_type": "quick_reply",
                    "index": "1",
                    "parameters": [
                        {
                            "type": "payload",
                            "payload": `${RESTAURANT_REPLAY_WHATSAPP.REJECTED}:${orderId}`
                        }
                    ]
                },
                {
                    "type": "button",
                    "sub_type": "quick_reply",
                    "index": "2",
                    "parameters": [
                        {
                            "type": "payload",
                            "payload": `${RESTAURANT_REPLAY_WHATSAPP.ADDRESS_ERROR}:${orderId}`
                        }
                    ]
                },
                {
                    "type": "button",
                    "sub_type": "quick_reply",
                    "index": "3",
                    "parameters": [
                        {
                            "type": "payload",
                            "payload": `${RESTAURANT_REPLAY_WHATSAPP.DELIVERY_UNAVAILABLE}:${orderId}`
                        }
                    ]
                },
                {
                    "type": "button",
                    "sub_type": "quick_reply",
                    "index": "4",
                    "parameters": [
                        {
                            "type": "payload",
                            "payload": `${RESTAURANT_REPLAY_WHATSAPP.RESTAURANT_CLOSED}:${orderId}`
                        }
                    ]
                },
                {
                    "type": "button",
                    "sub_type": "quick_reply",
                    "index": "5",
                    "parameters": [
                        {
                            "type": "payload",
                            "payload": `${RESTAURANT_REPLAY_WHATSAPP.CONTACT_CLIENT}:${orderId}`
                        }
                    ]
                }

            ]
        }
    }
    try {
        const whatsappReq = await axios.post("https://graph.facebook.com/v20.0/467098409816102/messages", newOrderReceivedTemplate, { headers: { 'Authorization': `Bearer ${process.env.WHATSAPP_API_KEY}` } })
        const reqRes = whatsappReq.data as unknown as WhatsAppMessageResponse
        if (reqRes.messages[0].message_status === 'accepted') {
            return reqRes.messages[0].id
        } else {
            throw ('Send WhatsApp order failed')
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error(error)
    }

}