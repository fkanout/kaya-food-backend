export interface WhatsAppWebhook {
    object: string;
    entry: Entry[];
}

interface Entry {
    id: string;
    changes: Change[];
}

interface Change {
    value: ChangeValue;
    field: string;
}

interface ChangeValue {
    messaging_product: string;
    metadata: Metadata;
    contacts: Contact[];
    messages: Message[];
}

interface Metadata {
    display_phone_number: string;
    phone_number_id: string;
}

interface Contact {
    profile: Profile;
    wa_id: string;
}

interface Profile {
    name: string;
}

interface Message {
    context: MessageContext;
    from: string;
    id: string;
    timestamp: string;
    type: string;
    button: Button;
}

interface MessageContext {
    from: string;
    id: string;
}

interface Button {
    payload?: string;
    id?: string;
    text: string;
}

export interface WhatsAppMessageResponse {
    messaging_product: string;
    contacts: Contact[];
    messages: Message[];
}

interface Contact {
    input: string;
    wa_id: string;
}

interface Message {
    id: string;
    message_status: string;
}



export const RESTAURANT_REPLAY_WHATSAPP = {
    ACCEPTED: "accepted",
    REJECTED: "rejected",
    ADDRESS_ERROR: "address_error",
    DELIVERY_UNAVAILABLE: "delivery_unavailable",
    RESTAURANT_CLOSED: "restaurant_closed",
    CONTACT_CLIENT: "contact_client",
    1200: "sec_1200", // 20 min
    1800: "sec_1800", // 30 min
    2400: "sec_2400", // 40 min
    3000: "sec_3000", // 50 min   
    3600: "sec_3600", // 1 hour 
    4200: "sec_4200", // 1 hour 10 min
    5400: "sec_5400", // 1 hour 30 min
    7200: "sec_7200", // 2 hours
} as const