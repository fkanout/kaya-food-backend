import axios from "axios"
import { Item } from "../db/orders"
import { WhatsAppMessageResponse } from "../types"
export const sendWhatsappOrder = async ({
    // restaurantPhoneNumber,
    orderNumber,
    clientFirstName,
    clientLastName,
    clientPhoneNumber,
    clientResidence,
    clientBlock,
    clientFlat,
    order
}: {
    restaurantPhoneNumber: string,
    orderNumber: string,
    clientFirstName: string,
    clientLastName: string,
    clientPhoneNumber: string,
    clientResidence: string,
    clientBlock: string,
    clientFlat: string,
    order: Item[]
}) => {
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
                            "text": orderNumber
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

            ]
        }
    }
    try {
        console.log(newOrderReceivedTemplate)
        const whatsappReq = await axios.post("https://graph.facebook.com/v20.0/467098409816102/messages", newOrderReceivedTemplate, { headers: { 'Authorization': `Bearer ${process.env.GRAPH_API_TOKEN}` } })
        console.log(whatsappReq.statusText)
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