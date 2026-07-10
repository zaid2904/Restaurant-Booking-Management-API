// create a new booking 
// POST /api/bookings

import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.js";




// get loggd In user bookings
// get api/bookings/my
// @access Private
export const createBooking = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
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
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ message: "error.message" })
  }
}



// cancle a bookings
// get api/bookings/my
// @access Private

export const getMyBooking = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ message: "error.message" })
  }
}