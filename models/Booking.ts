import crypto from 'crypto';
import { Document, model, Schema, Types } from 'mongoose';

export interface IBooking extends Document {
  user: Types.ObjectId;
  restaurant: Types.ObjectId;
  date: Date;
  time: string;
  guests: number;
  occation?: string;
  specialRequests?: string;
  status: "confirm" | "cancelled" | "completed";
  bookingId: string;
  createadAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    user: { type: Schema.Types.ObjectId, ref: "user", required: true },
    restaurant: { type: Schema.Types.ObjectId, ref: "Restaurant", required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    guests: { type: Number, required: true, min: 1 },
    occation: { type: String, trim: true },
    specialRequests: { type: String, trim: true },
    status: { type: String, enum: ["confirm", "cancelled", "completed"], default: "confirm" },
    bookingId: { type: String, unique: true }
  },
  {
    timestamps: true
  }
)
BookingSchema.pre("save", function () {
  if (!this.bookingId) {
    this.bookingId = `GR-${crypto.randomBytes(4).toString("hex").toUpperCase()}`
  }
})

export const Booking = model<IBooking>("Booking", BookingSchema)



