export interface WhatsAppWebhook {
    object: string;
    entry: Entry[];
    messages?: InteractiveMessages;
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
    payload: string;
    text: string;
}

export interface WhatsAppMessageResponse {
    messaging_product: string;
    contacts: Contact[];
    messages: Message[]
}

interface Contact {
    input: string;
    wa_id: string;
}

interface Message {
    id: string;
    message_status: string;
}
type InteractiveMessages = {
    context: {
        from: string;
        id: string;
    };
    from: string;
    id: string;
    timestamp: string;
    type: string;
    interactive: {
        type: string;
        button_reply: {
            id: string;
            title: string;
        };
    };
}[];


export const RESTAURANT_REPLAY_WHATSAPP = {
    ACCEPTED: "accepted",
    REJECTED: "rejected",
    ADDRESS_ERROR: "address_error",
    DELIVERY_UNAVAILABLE: "delivery_unavailable",
    RESTAURANT_CLOSED: "restaurant_closed",
    CONTACT_CLIENT: "contact_client",
    1800: "1800", // 30 min
    2700: "2700", // 45 min
    3600: "3600", // 1 hour 
} as const