import axios from "axios"
import { OFS_REPLIES, WhatsAppMessageResponse } from "../types"

export const sendFinishOFS = async ({
    // restaurantPhoneNumber,
    whatsAppOrderMessageId,
    orderId,
}: {
    restaurantPhoneNumber: string,
    whatsAppOrderMessageId: string,
    orderId: string,
}): Promise<string | undefined> => {
    const finishOFSTemplate = {
        "recipient_type": "individual",
        "messaging_product": "whatsapp",
        "to": "33750930539",//TODO: Restaurant phone number
        "type": "interactive",
        "interactive": {
            "type": "button",
            "body": {
                "text": "هل انتهيت من اختيار الطلبات او الملاحظات الغير متوفرة"
            },
            "action": {
                "buttons": [
                    {
                        "type": "reply",
                        "reply": {
                            "id": `OFS_${orderId}_${OFS_REPLIES.DONE}`,
                            "title": "تم و أرسل إلى الزبون"
                        }
                    },
                    {
                        "type": "reply",
                        "reply": {
                            "id": `OFS_${orderId}_${OFS_REPLIES.REDO}`,
                            "title": "أعد الأختيار من جديد"
                        }
                    }
                ]
            }
        },
        context: {
            message_id: whatsAppOrderMessageId
        }
    };
    try {
        console.log(JSON.stringify(finishOFSTemplate))
        const whatsappReq = await axios.post("https://graph.facebook.com/v20.0/467098409816102/messages", finishOFSTemplate, { headers: { 'Authorization': `Bearer ${process.env.WHATSAPP_API_KEY}` } })
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