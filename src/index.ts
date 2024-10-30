import { constructRestaurant } from "./helpers/bany";
import {  RESTAURANTS_URL } from "./helpers/constant";

(async ()=>{
  const restaurant = await constructRestaurant(RESTAURANTS_URL.HAWA_MAHAL);
  console.log(restaurant.categories[0].products[0]);
})()
