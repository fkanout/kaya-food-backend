import axios from "axios";
import * as cheerio from 'cheerio';
import { Category, Entity, RawRestaurant } from "./types";

 
async function fetchJsonFromScriptTag(url: string): Promise<RawRestaurant | null> {
    try {
        const response = await axios.get(url);
        const html: string = response.data;
        const $ = cheerio.load(html);
        const scriptContent: string | null = $('#__NEXT_DATA__').html();
        if (scriptContent) {
            const jsonData = JSON.parse(scriptContent);
            return jsonData.props.pageProps;
        } else {
            throw new Error("Script tag with id='next data' not found or empty.");
        }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error fetching JSON:", error.message);
        return null;
    }
}
export const extractRestaurantInfo = (rawEntity: Entity | null)=>{
    if (!rawEntity){
        throw ("No restaurant data")
    }
    const entity = {
        id: rawEntity.idString,
        restaurantTitle: {
            ar: rawEntity.translations[0]?.title,
            en: rawEntity.translations[1]?.title,
            tr: rawEntity.translations[2]?.title,
        },
        phoneNumber: rawEntity.phoneNumber,
        whatsappPhoneNumber: rawEntity.whatsappPhoneNumber,
        socialMediaUrls: rawEntity.socialMediaUrls,
        updatedAt: rawEntity.updatedAt,
        logo: rawEntity.media.logo,
        cover: rawEntity.media.cover?.endsWith("https://trybany.com/images/restaurant-cover.png") ? rawEntity.media.logo : rawEntity.media.cover
    }
    return entity
}

export const extractRestaurantCategories = (rawCategories: Category[])=>{
    if (!rawCategories){
        throw ("No categories data")
    }
    const categories = rawCategories.map(category=>{
        return {
            id: category.idString,
            title: {
                ar: category.translations[0]?.title,
                en: category.translations[1]?.title,
                tr: category.translations[2]?.title,
            },
            productsCount: category.productsCount,
            categoryImg: category.firstProduct?.media?.cover
        }
    });
    return categories
}

export const constructRestaurant = async (id: string)=>{
    const restaurantRawData = await fetchJsonFromScriptTag(id);
    if (!restaurantRawData) throw ("No raw data");
    const restaurantInfo = extractRestaurantInfo(restaurantRawData.entity);
    const restaurantCategories = extractRestaurantCategories(restaurantRawData.categories);
    const restaurant = ({...restaurantInfo, categories: restaurantCategories});
    return restaurant
}