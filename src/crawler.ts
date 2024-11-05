import { constructRestaurant } from "./helpers/bany/bany";
import { RESTAURANTS_IDS, RESTAURANTS_URL_BANY, RESTAURANTS_URL_LAMAZ, RESTAURANTS_URL_QRLIST } from "./helpers/constant";
import { pushFileToGitHub } from "./helpers/github";
import { constructLamazRestaurant } from "./helpers/lamaz";
import { constructQRListRestaurant } from "./helpers/qrlist/qrlist";

export const startCrawler = async () => {
    const saveBanyRestaurants = async () => {
        const restaurant_TAZEH_KASAP_KAYA = await constructRestaurant(RESTAURANTS_URL_BANY.TAZEH_KASAP_KAYA, RESTAURANTS_IDS.TAZEH_KASAP_KAYA);
        pushFileToGitHub(restaurant_TAZEH_KASAP_KAYA, restaurant_TAZEH_KASAP_KAYA.id);

        const restaurant_BLUDAN_KAYA = await constructRestaurant(RESTAURANTS_URL_BANY.BLUDAN_KAYA, RESTAURANTS_IDS.BLUDAN_KAYA);
        pushFileToGitHub(restaurant_BLUDAN_KAYA, restaurant_BLUDAN_KAYA.id);

        const restaurant_FALAFEL_SARAYI = await constructRestaurant(RESTAURANTS_URL_BANY.FALAFEL_SARAYI, RESTAURANTS_IDS.FALAFEL_SARAYI);
        pushFileToGitHub(restaurant_FALAFEL_SARAYI, restaurant_FALAFEL_SARAYI.id);

        const restaurant_KARADISH = await constructRestaurant(RESTAURANTS_URL_BANY.KARADISH, RESTAURANTS_IDS.KARADISH);
        pushFileToGitHub(restaurant_KARADISH, restaurant_KARADISH.id);

        const restaurant_HAWA_MAHAL = await constructRestaurant(RESTAURANTS_URL_BANY.HAWA_MAHAL, RESTAURANTS_IDS.HAWA_MAHAL);
        pushFileToGitHub(restaurant_HAWA_MAHAL, restaurant_HAWA_MAHAL.id);

        const restaurant_ATA = await constructRestaurant(RESTAURANTS_URL_BANY.ATA, RESTAURANTS_IDS.ATA);
        pushFileToGitHub(restaurant_ATA, restaurant_ATA.id);
    }


    const saveQRListRestaurants = async () => {
        const restaurant_BEIT_BEYRUT = await constructQRListRestaurant(RESTAURANTS_URL_QRLIST.BEIT_BEYRUT)
        pushFileToGitHub(restaurant_BEIT_BEYRUT, restaurant_BEIT_BEYRUT.id);
    }

    const saveLamazRestaurants = async () => {
        const restaurant_SAJ = await constructLamazRestaurant(RESTAURANTS_URL_LAMAZ.SAJ, RESTAURANTS_IDS.SAJ)
        pushFileToGitHub(restaurant_SAJ, restaurant_SAJ.id);
    }

    await saveBanyRestaurants();
    await saveQRListRestaurants();
    await saveLamazRestaurants();

}

