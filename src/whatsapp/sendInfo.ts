

import axios from "axios"
import { WhatsAppMessageResponse } from "../types"

export const sendInfo = async ({
    // restaurantPhoneNumber,
    whatsAppOrderMessageId,
}: {
    restaurantPhoneNumber: string,
    whatsAppOrderMessageId: string,
}): Promise<string | undefined> => {
    const infoTemplate = {
        "recipient_type": "individual",
        "messaging_product": "whatsapp",
        "to": "33750930539",//TODO: Restaurant phone number
        "type": "text",
        "text": {
            "body": "تم ارسال الطلب المعدّل و بإنتظار تأكيد الزبون"
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
            throw ('sendFinishOFS failed')
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error(JSON.stringify(error))
    }

}