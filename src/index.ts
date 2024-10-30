import { constructRestaurant } from "./helpers/bany";
import {  RESTAURANTS_URL } from "./helpers/constant";

(async ()=>{
  const restaurant = await constructRestaurant(RESTAURANTS_URL.FALAFEL_SARAYI);
  console.log(restaurant.categories[3].products);
})()
