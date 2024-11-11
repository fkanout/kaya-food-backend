import axios from "axios"
import { WhatsAppMessageResponse } from "../types"
export const sendETARequest = async ({
    // restaurantPhoneNumber,
    whatsAppOrderMessageId,
    orderId
}: {
    restaurantPhoneNumber: string,
    whatsAppOrderMessageId: string,
    orderId: string
}): Promise<string | undefined> => {
    // const etaTemplate = {
    //     "messaging_product": "whatsapp",
    //     "to": "33750930539",//TODO: restaurantPhoneNumber
    //     "type": "template",
    //     "template": {
    //         "name": "eta",
    //         "language": {
    //             "code": "ar"
    //         },
    //         "components": [
    //             {
    //                 "type": "header",
    //                 "parameters": [
    //                     {
    //                         "type": "text",
    //                         "text": "This is my order"
    //                     }
    //                 ]
    //             },
    //             {
    //                 "type": "button",
    //                 "sub_type": "quick_reply",
    //                 "index": "0",
    //                 "parameters": [
    //                     {
    //                         "type": "payload",
    //                         "payload": `${1200}:${orderId}`
    //                     }
    //                 ]
    //             },
    //             {
    //                 "type": "button",
    //                 "sub_type": "quick_reply",
    //                 "index": "1",
    //                 "parameters": [
    //                     {
    //                         "type": "payload",
    //                         "payload": `${1800}:${orderId}`
    //                     }
    //                 ]
    //             },
    //             {
    //                 "type": "button",
    //                 "sub_type": "quick_reply",
    //                 "index": "2",
    //                 "parameters": [
    //                     {
    //                         "type": "payload",
    //                         "payload": `${2400}:${orderId}`
    //                     }
    //                 ]
    //             },
    //             {
    //                 "type": "button",
    //                 "sub_type": "quick_reply",
    //                 "index": "3",
    //                 "parameters": [
    //                     {
    //                         "type": "payload",
    //                         "payload": `${3000}:${orderId}`
    //                     }
    //                 ]
    //             },
    //             {
    //                 "type": "button",
    //                 "sub_type": "quick_reply",
    //                 "index": "4",
    //                 "parameters": [
    //                     {
    //                         "type": "payload",
    //                         "payload": `${3600}:${orderId}`
    //                     }
    //                 ]
    //             },
    //             {
    //                 "type": "button",
    //                 "sub_type": "quick_reply",
    //                 "index": "5",
    //                 "parameters": [
    //                     {
    //                         "type": "payload",
    //                         "payload": `${4200}:${orderId}`
    //                     }
    //                 ]
    //             },
    //             {
    //                 "type": "button",
    //                 "sub_type": "quick_reply",
    //                 "index": "6",
    //                 "parameters": [
    //                     {
    //                         "type": "payload",
    //                         "payload": `${5400}:${orderId}`
    //                     }
    //                 ]
    //             },
    //             {
    //                 "type": "button",
    //                 "sub_type": "quick_reply",
    //                 "index": "7",
    //                 "parameters": [
    //                     {
    //                         "type": "payload",
    //                         "payload": `${7200}:${orderId}`
    //                     }
    //                 ]
    //             },


    //         ]
    //     },
    //     context: {
    //         message_id: whatsAppOrderMessageId
    //     }
    // }
    const etaTemplate = {
        messaging_product: 'whatsapp',
        to: "33750930539",
        type: 'interactive',
        interactive: {
            type: 'button',
            body: {
                text: 'Please select an option:'
            },
            action: {
                buttons: [
                    {
                        type: 'reply',
                        reply: {
                            id: `${1200}_${orderId}`,
                            title: '٢٠ دقيقة'
                        }
                    },
                    {
                        type: 'reply',
                        reply: {
                            id: `${1800}_${orderId}`,
                            title: '٣٠ دقيقة'
                        }
                    },
                    {
                        type: 'reply',
                        reply: {
                            id: `${2400}_${orderId}`,
                            title: '٤٠ دقيقة'
                        }
                    },
                    {
                        type: 'reply',
                        reply: {
                            id: `${3000}_${orderId}`,
                            title: '٥٠ دقيقة'
                        }
                    },
                    {
                        type: 'reply',
                        reply: {
                            id: `${3600}_${orderId}`,
                            title: '١ ساعة'
                        }
                    },
                    {
                        type: 'reply',
                        reply: {
                            id: `${4200}_${orderId}`,
                            title: '١ ساعة و ١٠ دقائق'
                        }
                    },
                    {
                        type: 'reply',
                        reply: {
                            id: `${5400}_${orderId}`,
                            title: '١ ساعة ونصف'
                        }
                    },
                    {
                        type: 'reply',
                        reply: {
                            id: `${7200}_${orderId}`,
                            title: '٢ ساعة'
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
        const whatsappReq = await axios.post("https://graph.facebook.com/v20.0/467098409816102/messages", etaTemplate, { headers: { 'Authorization': `Bearer ${process.env.WHATSAPP_API_KEY}` } })
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