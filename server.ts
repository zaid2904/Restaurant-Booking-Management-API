import cors from "cors";
import dotenv from "dotenv";
import type { NextFunction, Request, Response } from 'express';
import express from 'express';
import connectDB from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import restaurantRouter from "./routes/restaurantRoutes.js";
const app = express();
dotenv.config();

// Connect to mongoDB 
await connectDB()

// Middleware
app.use(cors())
app.use(express.json());

const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Server is Live!');
});

app.use("/api/auth", authRouter)
app.use('/api/restaurants', restaurantRouter)
app.use('/api/bookings', bookingRouter)

// Global Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Unhandle Error:", err)
  res.status(500).json({
    message: err.message || "Internal server Error",
    stack: process.env.NODE_ENV === "production" ? undefined
      : err.stack,
  })
})


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});