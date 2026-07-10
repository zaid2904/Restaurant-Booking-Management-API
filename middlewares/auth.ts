import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { IUser, User } from "../models/User.js";

export interface AuthRequest extends Request {
  user?: IUser
}


export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string }
      // get user from the token exclude passoword
      const user = await User.findById(decoded.id).select("-password")
      if (!user) {
        res.status(401).json({ message: "Not authorized, user not found" })
        return;
      }

      req.user = user;
      next();

    } catch (error) {
      console.log("Auth Middleware Errror:", error)
      res.status(401).json({ message: "Not authorized, token failed" })
      return;
    }
  }
  if (!token) {
    res.status(401).json({
      message: "Not authorized, no token"
    })
  }
}

// admin only
export const adminOnly = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.user && req.user.role === "admin") {
    next()
  }
  else {
    res.status(403).json({ message: "Access denied , admin role required" })
  }
}


// owner Only

export const ownerOnly = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.user && (req.user.role === "owner" || req.user.role === "admin")) {
    next()
  }
  else {
    res.status(403).json({ message: "Access denied , owner role required" })
  }
}
