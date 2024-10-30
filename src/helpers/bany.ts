import axios from "axios";
import * as cheerio from 'cheerio';
import { Category, Entity, RawRestaurant, RestaurantURL } from "./types";
import path from "path";

 
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
        whatsappPhoneNumber: rawEntity.whatsappPhoneNumber,
        socialMediaUrls: rawEntity.socialMediaUrls,
        updatedAt: rawEntity.updatedAt,
        logo: rawEntity.media.logo,
        cover: rawEntity.media.cover?.endsWith("https://trybany.com/images/restaurant-cover.png") ? rawEntity.media.logo : rawEntity.media.cover
    }
    return entity
}
export const constructCategoryProducts = async (restaurantURL: RestaurantURL, categorySlug: string)=>{
    try {
        const rawProduct = await fetchJsonFromScriptTag(path.join(restaurantURL,"categories", categorySlug, "products"))
        return rawProduct?.products || [];
    } catch (error) {
        console.log(error);
        return []
    }   
}

export const extractRestaurantCategories = async (restaurantURL: RestaurantURL, rawCategories: Category[], restaurantCoverImgURL: string | null)=>{
    if (!rawCategories){
        throw ("No categories data")
    }
    const categories = await Promise.all(rawCategories.map(
        async (category)=> {
        const products = await constructCategoryProducts(restaurantURL, category.slug);
        const img = products[0]?.media.cover?.endsWith("/product-cover.png?ver=1") ? restaurantCoverImgURL :  products[0]?.media.cover;

        return {
            id: category.idString,
            slug: category.slug,
            title: {
                ar: category.translations[0]?.title,
                en: category.translations[1]?.title,
                tr: category.translations[2]?.title,
            },
         
            productsCount: products?.length,
            categoryImg: img,
            products: products?.map((product)=>({
                title: {
                    ar: product.translations[0]?.title,
                    en: product.translations[1]?.title,
                    tr: product.translations[2]?.title,
                },
                description: {
                    ar: product.translations[0]?.description,
                    en: product.translations[1]?.description,
                    tr: product.translations[2]?.description,
                },
                img: product.media.cover || img,
                price: product.price,
                
            }))
        }
    }));
    return categories
}



export const constructRestaurant = async (restaurantURL: RestaurantURL)=>{
    const restaurantRawData = await fetchJsonFromScriptTag(restaurantURL);
    if (!restaurantRawData) throw ("No raw data");
    const restaurantInfo = extractRestaurantInfo(restaurantRawData.entity);
    const restaurantCategories = await extractRestaurantCategories(restaurantURL, restaurantRawData.categories, restaurantInfo.logo);
    const restaurant = ({...restaurantInfo, categories: restaurantCategories});
    return restaurant
}

