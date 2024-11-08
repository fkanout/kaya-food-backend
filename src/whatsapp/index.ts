import axios from 'axios';
const WHATSAPP_API_URL = "https://graph.facebook.com/v20.0/467098409816102/messages"
export const requester = (template: Record<string, string>, toPhoneNumber: string) => {
    axios.post(
        WHATSAPP_API_URL,
        {
            messaging_product: 'whatsapp',
            to: toPhoneNumber,
            type: 'template',
            template: {
                name: 'hello_world',
                language: {
                    code: 'en_US'
                }
            }
        },
        {
            headers: {
                'Authorization': `Bearer ${process.env.WHATSAPP_API_KEY}`,
                'Content-Type': 'application/json'
            }
        }
    )
        .then(response => {
            console.log(response.data);
        })
        .catch(error => {
            console.error(error);
        });
}

