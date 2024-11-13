import axios from "axios"
import { Item } from "../db/orders"
import { OFS_REPLIES, WhatsAppMessageResponse } from "../types"
export const sendModifyOrder = async ({
    // restaurantPhoneNumber,
    orderId,
    order,
}: {
    restaurantPhoneNumber: string,
    orderId: string,
    order: Item[],
}): Promise<string | undefined> => {

    const modifyOrderTemplate = {
        "messaging_product": "whatsapp",
        "to": "33750930539",//TODO: restaurantPhoneNumber
        "type": "template",
        "template": {
            "name": "modify_order",
            "language": {
                "code": "ar"
            },
            "components": [
                {
                    "type": "body",
                    "parameters": [
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
                            "payload": `${OFS_REPLIES.NOT_AVAILABLE_SELECTED}:${orderId}`
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
                            "payload": `${OFS_REPLIES.NOTE_ISSUE_SELECTED}:${orderId}`
                        },
                    ]
                },
                {
                    "type": "button",
                    "sub_type": "quick_reply",
                    "index": "2",
                    "parameters": [
                        {
                            "type": "payload",
                            "payload": `${OFS_REPLIES.DONE}:${orderId}`
                        },
                    ]
                },
                {
                    "type": "button",
                    "sub_type": "quick_reply",
                    "index": "3",
                    "parameters": [
                        {
                            "type": "payload",
                            "payload": `${OFS_REPLIES.REDO}:${orderId}`
                        }
                    ]
                },

            ]
        }
    }
    try {
        const whatsappReq = await axios.post("https://graph.facebook.com/v20.0/467098409816102/messages", modifyOrderTemplate, { headers: { 'Authorization': `Bearer ${process.env.WHATSAPP_API_KEY}` } })
        const reqRes = whatsappReq.data as unknown as WhatsAppMessageResponse
        if (reqRes.messages[0].message_status === 'accepted') {
            return reqRes.messages[0].id
        } else {
            throw ('sendWhatsappOrder failed')
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error(error)
    }

}