

import axios from "axios"
import { WhatsAppMessageResponse } from "../types"

export const sendInfo = async ({
    restaurantPhoneNumber,
    whatsAppOrderMessageId,
    body,
}: {
    restaurantPhoneNumber: string,
    whatsAppOrderMessageId: string,
    body: string
}): Promise<string | undefined> => {
    const infoTemplate = {
        "recipient_type": "individual",
        "messaging_product": "whatsapp",
        "to": restaurantPhoneNumber,
        "type": "text",
        "text": {
            "body": body
        },
        "context": {
            message_id: whatsAppOrderMessageId
        }
    }

    try {
        console.log(JSON.stringify(infoTemplate))
        const whatsappReq = await axios.post("https://graph.facebook.com/v20.0/467098409816102/messages", infoTemplate, { headers: { 'Authorization': `Bearer ${process.env.WHATSAPP_API_KEY}` } })
        const reqRes = whatsappReq.data as unknown as WhatsAppMessageResponse
        if (reqRes.messages[0].message_status === 'accepted') {
            return reqRes.messages[0].id
        } else {
            throw ('sendInfo failed')
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error(JSON.stringify(error))
    }

}