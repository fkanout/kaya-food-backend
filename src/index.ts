import { constructRestaurant } from "./helpers/bany";
import { RESTAURANTS } from "./helpers/constant";

(async ()=>{
  const restaurant = await  constructRestaurant(RESTAURANTS.HAWA_MAHAL);
  console.log(restaurant.categories);

})()
