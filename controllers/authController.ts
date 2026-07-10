import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { AuthRequest } from "../middlewares/auth.js";
import { User } from "../models/User.js";

// Helper to generate jwt token
const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: "30d" })
}


// Register new User
// POST /api/auth/register
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, phone, role } = req.body
    if (!name || !email || !password) {
      res.status(400).json({ message: "Please enter all require field" })
      return;
    }

    // if user exists in database
    const userExists = await User.findOne({ email })
    if (userExists) {
      res.status(400).json({ message: "User already exists" })
      return;
    }
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create a User
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role
    })
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token: generateToken(user._id.toString())
      })
    }
    else {
      res.status(400).json({ message: "Invalid user data" })
    }
  } catch (error: any) {
    res.status(400).json({
      message: error.message
    })
  }
}




// Authenticate user and and 
// POST /api/auth/login
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      res.status(400).json({ message: "Please Provide Email and password" })
      return;
    }

    // check for user
    const user = await User.findOne({ email })
    if (!user) {
      res.status(400).json({ message: "Invalid email or password" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password || "")
    if (!isMatch) {
      res.status(401).json({
        message: "Invalid email or password"
      })
      return;
    }
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token: generateToken(user._id.toString())
    })
  } catch (error: any) {
    res.status(400).json({
      message: error.message
    })
  }
}



// get user profile
// POST /api/auth/me
// @access Private
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Not authorized" })
      return;
    }
    res.json(req.user)
  } catch (error: any) {
    console.log(error);
    res.status(400).json({
      message: error.message
    })
  }
}