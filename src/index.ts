import { constructRestaurant } from "./helpers/bany";
import { RESTAURANTS_IDS, RESTAURANTS_URL } from "./helpers/constant";
import { pushFileToGitHub } from "./helpers/github";

(async () => {

  const restaurant_TAZEH_KASAP_KAYA = await constructRestaurant(RESTAURANTS_URL.TAZEH_KASAP_KAYA, RESTAURANTS_IDS.TAZEH_KASAP_KAYA);
  pushFileToGitHub(restaurant_TAZEH_KASAP_KAYA, restaurant_TAZEH_KASAP_KAYA.id);

  const restaurant_BLUDAN_KAYA = await constructRestaurant(RESTAURANTS_URL.BLUDAN_KAYA, RESTAURANTS_IDS.BLUDAN_KAYA);
  pushFileToGitHub(restaurant_BLUDAN_KAYA, restaurant_BLUDAN_KAYA.id);

  const restaurant_FALAFEL_SARAYI = await constructRestaurant(RESTAURANTS_URL.FALAFEL_SARAYI, RESTAURANTS_IDS.FALAFEL_SARAYI);
  pushFileToGitHub(restaurant_FALAFEL_SARAYI, restaurant_FALAFEL_SARAYI.id);

  const restaurant_KARADISH = await constructRestaurant(RESTAURANTS_URL.KARADISH, RESTAURANTS_IDS.KARADISH);
  pushFileToGitHub(restaurant_KARADISH, restaurant_KARADISH.id);

  const restaurant_HAWA_MAHAL = await constructRestaurant(RESTAURANTS_URL.HAWA_MAHAL, RESTAURANTS_IDS.HAWA_MAHAL);
  pushFileToGitHub(restaurant_HAWA_MAHAL, restaurant_HAWA_MAHAL.id);
})()
