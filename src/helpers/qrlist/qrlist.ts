import axios from "axios"
import { ApiResponse, RawProduct } from "./types";
import { Category, Restaurant } from "../types";
import { RESTAURANTS_IDS } from "../constant";
import path from "path";

function extractStoreId(url: string): string {
    const urlObj = new URL(url);
    return urlObj.searchParams.get("store_id") || "";
}

const getCategoryURL = (restaurantId: string, categoryId: string, lang: string = "ar") => {
    return `https://qrlist.app/api/material?offset=0&limit=100&app_locale=${lang}&category_id=${categoryId}&store_id=${restaurantId}`
}

const constructCategoryProducts = async (categoryURL: string): Promise<RawProduct[]> => {
    try {
        const { data: { data } } = await axios(categoryURL);
        return data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error fetching QRList products", error)
        return []
    }

}
const getEntity = (restaurantId: string): Restaurant => {
    // BEIT_BEYRUT
    let entity;
    if (restaurantId === "93") {
        entity = {
            id: RESTAURANTS_IDS.BEIT_BEYRUT,
            restaurantTitle: {
                ar: 'بيت بيروت',
                en: "BEIT BEYRUT",
                tr: "BEIT BEYRUT"
            },
            whatsappPhoneNumber: "+905331301731",
            socialMediaUrls: {
                instagram: "https://www.instagram.com/beitbeyrut/?hl=en",
                googleMapsLink: "https://g.co/kgs/K1Qww9L"
            },
            updatedAt: new Date().getTime(),
            logo: "https://qrlist.app/storage/uploads/folder_1/subfolder_3/dc98e2d132fc25806d62388d62f9044a.png",
            cover: "https://qrlist.app/storage/beitbeyrutgn/slider/a218dbabd63cee115552b72a2525d0ae.jpg",
            categories: [] as Category[]
        }

    }

    if (!entity) {
        throw ("No restaurant")
    }
    return entity

}
export const constructQRListRestaurant = async (restaurantURL: string): Promise<Restaurant> => {

    const restaurantId = extractStoreId(restaurantURL);
    const entity = getEntity(restaurantId);
    const { data } = await axios(restaurantURL)
    const rawCategories = data as ApiResponse;
    if (!data.success) {
        throw `Error fetching ${restaurantId} from ${restaurantURL}`
    }
    const categories = await Promise.all(rawCategories.data.map(
        async (category) => {
            const categoryURL = getCategoryURL(restaurantId, category.id.toString(), "ar");
            const products = await constructCategoryProducts(categoryURL);
            return {
                id: String(category.id),
                slug: category.name,
                title: {
                    ar: category.name,
                },
                categoryImg: path.join("https://qrlist.app/storage", category.image),
                productsCount: products?.length,
                products: products?.map((product) => ({
                    id: String(product.id),
                    title: {
                        ar: product.name
                    },
                    description: {
                        ar: product.summary,
                        en: null,
                        tr: null
                    },
                    img: path.join("https://qrlist.app/storage", product.images[0].image),
                    price: product.price

                }))
            }
        }))
    return ({ ...entity, categories: categories });
}