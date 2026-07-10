import { Router } from "express"
import { getFeaturedRestaurats, getRestaurantAvailability, getRestauratBySlug, getRestaurats } from "../controllers/restaurantController.js"

const restaurantRouter = Router()

restaurantRouter.get('/', getRestaurats)
restaurantRouter.get('/featured', getFeaturedRestaurats)
restaurantRouter.get('/:slug', getRestauratBySlug)
restaurantRouter.get('/:id/availability', getRestaurantAvailability)


export default restaurantRouter;

