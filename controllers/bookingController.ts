// create a new booking 
// POST /api/bookings

import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.js";
import { Booking } from "../models/Booking.js";
import { Restaurant } from "../models/Restaurant.js";




// get loggd In user bookings
// get api/bookings/my
// @access Private
export const createBooking = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { restaurantId, date, time, guests, occation, specialRequests } = req.body;
    if (!restaurantId || !date || !time || !guests) {
      res.status(400).json({
        message: "please provide all required reservation details"
      })
      return;
    }
    const restaurant = await Restaurant.findById(restaurantId)
    if (!restaurant) {
      res.status(404).json({ message: "Restaurant not found" })
      return;
    }
    if (restaurant.status !== "approved") {
      res.status(400).json({ message: "Reservation are not open for this restaurant yet" })
      return;
    }
    // verify seat availability
    const requestedGuests = Number(guests);

    const existingBookings = await Booking.find({
      restaurant: restaurantId,
      date: new Date(date),
      time,
      status: "confirmed"
    })

    const bookedSeats = existingBookings.reduce((sum, b) => sum + b.guests, 0)

    const totalSeates = restaurant.totalSeates || 20;
    const availableSeats = totalSeates - bookedSeats

    if (requestedGuests > availableSeats) {
      res.status(400).json({
        message: `Unable to reserve. Only ${availableSeats} seats are available for this time slot.`,
      })
    }

    const booking = await Booking.create({
      user: req.user?._id,
      restaurant: restaurantId,
      date: new Date(date),
      time,
      guests: Number(guests),
      occation,
      specialRequests,
      status: "confirmed",
    })

    const populatedBooking = await booking.populate("restaurant", "name location image address")

    res.status(201).json(populatedBooking)

  } catch (error: any) {
    console.log(error);
    res.status(400).json({ message: "error.message" })
  }
}



// get loggd In user bookings
// get api/bookings/my
// @access Private
export const getMyBooking = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const bookings = await Booking.find({ user: req.user?._id }).populate("restaurant",
      "name location image address slug"
    ).sort({ date: -1, time: -1 })
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ message: "error.message" })
  }
}






// cancel a bookings
// PUT api/bookings/:id/cancel
// @access Private
export const cancelBookings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const booking = await Booking.findById(req.params.id)
    if (!booking) {
      res.status(404).json({
        message: "Booking not found"
      })
      return;
    }
    booking.status = "cancelled"
    await booking.save()
    const populatedBooking = await booking.populate("restaurant", "name location image address")
    res.json(populatedBooking)
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ message: "error.message" })
  }
}