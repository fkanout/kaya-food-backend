import axios from "axios"
import { OFS_REPLIES, WhatsAppMessageResponse } from "../types"
import { Item } from "../db/orders";

export const sendOFS = async ({
    // restaurantPhoneNumber,
    whatsAppOrderMessageId,
    orderId,
    items
}: {
    restaurantPhoneNumber: string,
    whatsAppOrderMessageId: string,
    orderId: string,
    items: Item[]
}): Promise<string | undefined> => {
    const ofsTemplate = {
        "recipient_type": "individual",
        "messaging_product": "whatsapp",
        "to": "33750930539",//TODO: Restaurant phone number
        "type": "interactive",
        "interactive": {
            "type": "list",
            "header": {
                "type": "text",
                "text": "تحديث الطلب"
            },
            "body": {
                "text": "يرجى اختيار أي عنصر غير متوفر أو به مشكلة في الملاحظة."
            },
            "footer": {
                "text": "كل "
            },
            "action": {
                "button": "اختر عنصر واحد",
                "sections": [
                    {
                        "title": "غير متوفر",
                        "rows": items.map((item) => {
                            return {
                                "id": `OFS_${orderId}_${item.id}_${OFS_REPLIES.NOT_AVAILABLE}`,
                                "title": item.name + " " + "الغاء",
                                "description": item.quantity + " " + "عدد"
                            }
                        })
                    },
                    {
                        "title": "مشكلة في الملاحظة",
                        "rows": items.map((item) => {
                            return {
                                "id": `OFS_${orderId}_${item.id}_${OFS_REPLIES.NOTE_ISSUE}`,
                                "title": item.name + " " + " الغاء الملاحظة لـ",
                                "description": item.note
                            }
                        })
                    }
                ]
            }
        },
        context: {
            message_id: whatsAppOrderMessageId
        }
    };
    try {
        console.log(JSON.stringify(ofsTemplate))
        const whatsappReq = await axios.post("https://graph.facebook.com/v20.0/467098409816102/messages", ofsTemplate, { headers: { 'Authorization': `Bearer ${process.env.WHATSAPP_API_KEY}` } })
        const reqRes = whatsappReq.data as unknown as WhatsAppMessageResponse
        if (reqRes.messages[0].message_status === 'accepted') {
            return reqRes.messages[0].id
        } else {
            throw ('Send WhatsApp order failed')
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error(JSON.stringify(error))
    }

}