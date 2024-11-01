import axios from 'axios';
import * as cheerio from 'cheerio';
import path from 'path';
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
    products: []
};

function rgbaToHex(rgba: string): string {
    // Extract the RGBA components from the string
    const rgbaMatch = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);

    if (!rgbaMatch) {
        throw new Error("Invalid RGBA format");
    }

    // Convert RGB values to hex
    const r = parseInt(rgbaMatch[1], 10).toString(16).padStart(2, '0');
    const g = parseInt(rgbaMatch[2], 10).toString(16).padStart(2, '0');
    const b = parseInt(rgbaMatch[3], 10).toString(16).padStart(2, '0');

    // Handle alpha (opacity) if present
    let hex = `#${r}${g}${b}`;
    if (rgbaMatch[4] !== undefined) {
        const a = Math.round(parseFloat(rgbaMatch[4]) * 255).toString(16).padStart(2, '0');
        hex += a;
    }

    return hex;
}

const extractProducts = async (categoryURL: string): Promise<Product[]> => {
    try {
        const response = await axios.get(categoryURL);
        const html: string = response.data;
        const $ = cheerio.load(html);
        const rawProducts = $('div.MuiImageListItem-root');
        const products: Product[] = [];
        rawProducts.each((index, element) => {
            const price = parseInt($(element).find('div.MuiImageListItemBar-subtitle').text().replace(/[^\d.-]/g, "").replace(/\.00$/, ""))
            if (!price) {
                throw ("No price found - extractProducts ")
            }
            const relativeProductURL = $(element).find('a.MuiButtonBase-root').attr('href');
            const productId = relativeProductURL?.split('/').pop();
            if (!productId) {
                throw ("No productId found - extractProducts ")
            }
            const product = {
                id: productId,
                title: {
                    ar: $(element).find('div.MuiImageListItemBar-title').text(),
                },
                description: {
                    ar: null,
                    en: null,
                    tr: null,
                },
                price,
                img: $(element).find('img.object-cover').attr('src') || null,
            }
            products.push(product);
        });
        return products;
    } catch (error) {
        console.error("extractProducts", error)
        return []
    }
}


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
export const constructLamazRestaurant = async (restaurantURL: string, restaurantId: string): Promise<Restaurant> => {
    const response = await axios.get(restaurantURL);
    const html: string = response.data;
    const $ = cheerio.load(html);
    const rawCategories = $('div.MuiImageListItem-root');
    const promisesCategories = rawCategories.map((index, element) => {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve, reject) => {
            try {
                const relativeCategoryURL = $(element).find('a.MuiButtonBase-root').attr('href');
                const categoryId = relativeCategoryURL?.split('/').pop();
                if (!categoryId) {
                    throw ("Error constructLamazRestaurant No category Id ")
                }
                const fullCategoryURL = path.join(restaurantURL, categoryId);
                const products = await extractProducts(fullCategoryURL)
                const productsCount = products.length;
                if (productsCount === 0) {
                    throw ("Products count is 0 - constructLamazRestaurant ")
                }
                const category = {
                    id: restaurantId + "-" + categoryId,
                    slug: restaurantId + "-" + categoryId,
                    title: {
                        ar: $(element).find('div.MuiImageListItemBar-title.css-1w4d4gp').text(),
                    },
                    categoryImg: $(element).find('img.object-cover').attr('src'),
                    productsCount,
                    products
                } as Category;
                resolve(category);
            } catch (error) {
                reject(error);
            }
        });
    });
    const categories = await Promise.all(promisesCategories) as Category[];
    const logo = $('header div img.max-w-full').attr("src") || null;
    const cssLink = $('link[href$="/css"]');
    let coverColor = null;
    if (cssLink.length > 0) {
        const href = cssLink.attr('href');
        if (href) {
            const { data } = await axios(href)
            const match = data?.match(/--nav-bg-color\s*:\s*([^;]+);/i);
            if (match.length > 0) {
                coverColor = rgbaToHex(match[1]);
            }

        }
    } else {
        console.log("No CSS link found that ends with /css");
    }

    let restaurantTitle = {}
    let whatsappPhoneNumber = ""

    if (restaurantId === "osxzw-2fzue-tqqym") {
        restaurantTitle = {
            ar: "صاج",
            en: "SAJ",
            tr: "SAJ"
        }
        whatsappPhoneNumber = "+905010105000";
    }

    const entity = {
        id: restaurantId,
        restaurantTitle,
        whatsappPhoneNumber,
        socialMediaUrls: {},
        updatedAt: new Date().getTime(),
        logo,
        cover: null,
        coverColor,
        categories
    }
    return entity;
}