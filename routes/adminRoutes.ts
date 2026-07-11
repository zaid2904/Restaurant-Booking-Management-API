import { Router } from "express";
import { approvedRestaurant, getAdminStats, getAllRestaurant } from "../controllers/adminController.js";
import { adminOnly, protect } from "../middlewares/auth.js";


const adminRouter = Router()

adminRouter.use(protect)
adminRouter.use(adminOnly)

adminRouter.get("/restaurants", getAllRestaurant)
adminRouter.put("/restaurants/:id/approve", approvedRestaurant)
adminRouter.get("/stats", getAdminStats)


export default adminRouter