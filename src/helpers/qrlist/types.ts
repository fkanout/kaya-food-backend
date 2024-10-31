/* eslint-disable @typescript-eslint/no-explicit-any */

export type ApiResponse = {
    success: boolean;
    data: Item[];
};

type Item = {
    id: number;
    name: string;
    description: string;
    image: string;
};


export type RawProduct = {
    id: number;
    name: string;
    code: string;
    summary: string;
    price: number;
    definition_id: number;
    buying_details: string;
    store_id: number;
    average_rate: number | null;
    support_determiners: number;
    offers: any[];
    store: Record<string, any>; // Replace `Record<string, any>` with a specific type if you know the structure of the store object
    images: any[]; // Replace `any[]` with a specific type if you know the structure of images
    first_property_lookup_value: any | null;
    first_determiner: any | null;
    branches: any[]; // Replace `any[]` with a specific type if you know the structure of branches
};
