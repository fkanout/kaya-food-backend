import { RESTAURANTS_URL_BANY, RESTAURANTS_IDS } from "../constant";

export type RestaurantURL = (typeof RESTAURANTS_URL_BANY)[keyof typeof RESTAURANTS_URL_BANY];
export type RestaurantId = (typeof RESTAURANTS_IDS)[keyof typeof RESTAURANTS_IDS];


export type Translation = {
    title: string;
    description: string | null;
    notes: string | null;
    youtubeUrl: string | null;
    excerpt: string | null;
    locale: string;
    slug: string;
};
export type Media = {
    logo: string | null;
    icon: string | null;
    avatar: string | null;
    cover: string | null;
    gallery: string[];
    files: string[];
};
type Colors = {
    primary: string;
    primaryIsLight: boolean;
    secondary: string;
    secondaryIsLight: boolean;
};
type SocialMediaUrls = {
    twitter: string;
    facebook: string;
    instagram: string;
    googleMapsLink: string;
};

export type Entity = {
    idString: string;
    slug: string;
    translations: Translation[];
    phoneNumber: string;
    whatsappPhoneNumber: string;
    socialMediaUrls: SocialMediaUrls;
    selectedTheme: string | null;
    media: Media;
    redirectDestination: string | null;
    updatedAt: number;
    type: string;
    currentLocaleExists: boolean;
    colors: Colors;
    revalidateTtl: number;
};
export type RawProduct = {
    idString: string;
    slug: string;
    translations: Translation[];
    media: Media;
    parentCategoryId: string;
    categoryId: string;
    isActive: boolean;
    isNotAvailableSeasonally: boolean;
    minimumOrderableQuantity: number;
    unit: string | null;
    allPrices: [];
    price: {
        raw: number;
        formatted: string;
    };
    oldPrice: {
        raw: number;
        formatted: string;
    };
};
export type RawCategory = {
    idString: string;
    slug: string;
    translations: Translation[];
    productsCount: number;
    media: Media;
    firstProduct: RawProduct;
};

export type RawRestaurant = {
    entity: Entity;
    categories: RawCategory[];
    products: RawProduct[];
    status: number;
};

