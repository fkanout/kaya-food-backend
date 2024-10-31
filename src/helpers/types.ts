export type Category = {
    id: string;
    slug: string;
    title: {
        ar?: string;
        en?: string;
        tr?: string;
    };
    productsCount: number;
    categoryImg: string | null;
    products: Product[];
};

export type Product = {
    id: string;
    title: {
        ar?: string;
        en?: string;
        tr?: string;
    };
    description: {
        ar: string | null;
        en: string | null;
        tr: string | null;
    },
    price: number;
    img: string | null;
};

export type Restaurant = {
    id: string;
    restaurantTitle: {
        ar?: string;
        en?: string;
        tr?: string;
    };
    whatsappPhoneNumber: string;
    socialMediaUrls: {
        tiktok?: string;
        twitter?: string;
        facebook?: string;
        instagram?: string;
        googleMapsLink?: string;
    };
    updatedAt: number;
    logo: string | null;
    cover: string | null;
    categories: Category[];
};
