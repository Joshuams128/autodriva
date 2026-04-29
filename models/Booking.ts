import mongoose, { Schema, model, models } from 'mongoose';
import { nextSequence } from './Counter';

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type PaymentType = 'upfront' | 'post-service' | 'free';
export type PaymentStatus = 'unpaid' | 'paid' | 'invoiced';

export interface IBooking {
  _id: mongoose.Types.ObjectId;
  bookingRef: string;
  service: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: Date;
  timeSlot: string;
  notes?: string;
  status: BookingStatus;
  paymentType: PaymentType;
  paymentStatus: PaymentStatus;
  vehicleInfo?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    bookingRef: { type: String, required: true, unique: true, index: true },
    service: { type: String, required: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, required: true },
    date: { type: Date, required: true, index: true },
    timeSlot: { type: String, required: true },
    notes: { type: String },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
    paymentType: {
      type: String,
      enum: ['upfront', 'post-service', 'free'],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid', 'invoiced'],
      default: 'unpaid',
    },
    vehicleInfo: { type: String },
  },
  { timestamps: true }
);

export async function generateBookingRef(): Promise<string> {
  const year = new Date().getFullYear();
  const seq = await nextSequence(`booking-${year}`);
  return `AD-${year}-${String(seq).padStart(3, '0')}`;
}

const Booking =
  (models.Booking as mongoose.Model<IBooking>) || model<IBooking>('Booking', BookingSchema);

export default Booking;
