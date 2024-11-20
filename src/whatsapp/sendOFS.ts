import axios from "axios"
import { OFS_REPLIES, WhatsAppMessageResponse } from "../types"
import { Item } from "../db/orders";
import { sendInfo } from "./sendInfo";

export const sendOFS = async ({
    restaurantPhoneNumber,
    whatsAppOrderMessageId,
    orderId,
    items,
    isNoteIssue
}: {
    restaurantPhoneNumber: string,
    whatsAppOrderMessageId: string,
    orderId: string,
    items: Item[],
    isNoteIssue: boolean
}): Promise<string | undefined> => {
    const ofsTemplate = {
        "recipient_type": "individual",
        "messaging_product": "whatsapp",
        "to": restaurantPhoneNumber,
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
                        "rows": [{ id: "id", title: "title", description: "description" }]
                    }
                ]
            }
        },
        context: {
            message_id: whatsAppOrderMessageId
        }
    };
    try {
        if (ofsTemplate.interactive.action.sections[0] && ofsTemplate.interactive.action.sections[0].rows.length === 0) {
            sendInfo({ whatsAppOrderMessageId, restaurantPhoneNumber: '33750930539', body: "لا يوجد طلب لتعديله" })
            throw ('Nothing to modify')
        }
        if (isNoteIssue) {
            ofsTemplate.interactive.action.sections = [
                {
                    "title": "مشكلة في الملاحظة",
                    "rows": items.filter(item => item.note && item.note !== "").map((item) => {
                        return {
                            "id": `OFS_${orderId}_${item.id}_${OFS_REPLIES.NOTE_ISSUE}`,
                            "title": item.name.length > 24 ? item.name.slice(0, 21) + '...' : item.name,
                            "description": item.note.length > 72 ? item.note.slice(0, 68) + '...' : item.note,
                        }
                    })
                }

            ]
        } else if (!isNoteIssue && items.length !== 0) {
            ofsTemplate.interactive.action.sections = [
                {
                    "title": "غير متوفر",
                    "rows": items.map((item) => {
                        return {
                            "id": `OFS_${orderId}_${item.id}_${OFS_REPLIES.NOT_AVAILABLE}`,
                            "title": item.name.length > 24 ? item.name.slice(0, 21) + '...' : item.name,
                            "description": item.quantity + " " + "عدد"
                        }
                    })
                }
            ]
        }
        console.log("ofsTemplate:", JSON.stringify(ofsTemplate))

        const whatsappReq = await axios.post("https://graph.facebook.com/v20.0/467098409816102/messages", ofsTemplate, { headers: { 'Authorization': `Bearer ${process.env.WHATSAPP_API_KEY}` } })
        const reqRes = whatsappReq.data as unknown as WhatsAppMessageResponse
        if (reqRes.messages[0].message_status === 'accepted') {
            return reqRes.messages[0].id
        } else {
            throw ('sendOFS failed')
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error(JSON.stringify(error))
    }

}