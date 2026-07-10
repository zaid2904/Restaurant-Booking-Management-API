import { Router } from "express";
import { cancelBookings, createBooking, getMyBooking } from "../controllers/bookingController.js";
import { protect } from "../middlewares/auth.js";


const bookingRouter = Router()

bookingRouter.post("/", protect, createBooking)
bookingRouter.get("/my", protect, getMyBooking)
bookingRouter.put("/:id/cancel", protect, cancelBookings)


export default bookingRouter
