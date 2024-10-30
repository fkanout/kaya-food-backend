import { constructRestaurant } from "./helpers/bany";
import {  RESTAURANTS_IDS, RESTAURANTS_URL } from "./helpers/constant";
import { pushFileToGitHub } from "./helpers/github";

(async ()=>{
  const restaurant = await constructRestaurant(RESTAURANTS_URL.TAZEH_KASAP_KAYA, RESTAURANTS_IDS.TAZEH_KASAP_KAYA);
  console.log(restaurant);
  // console.log(restaurant.categories[3].products);
  pushFileToGitHub(restaurant, restaurant.id)
})()
