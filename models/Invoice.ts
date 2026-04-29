import mongoose, { Schema, model, models } from 'mongoose';
import { nextSequence } from './Counter';

export type InvoiceStatus = 'draft' | 'sent' | 'paid';

export interface ILineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface IInvoice {
  _id: mongoose.Types.ObjectId;
  invoiceNumber: string;
  bookingId?: mongoose.Types.ObjectId;
  customerName: string;
  customerEmail: string;
  lineItems: ILineItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: InvoiceStatus;
  dueDate: Date;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const LineItemSchema = new Schema<ILineItem>(
  {
    description: { type: String, required: true },
    quantity: { type: Number, required: true, default: 1 },
    unitPrice: { type: Number, required: true },
    total: { type: Number, required: true },
  },
  { _id: false }
);

const InvoiceSchema = new Schema<IInvoice>(
  {
    invoiceNumber: { type: String, required: true, unique: true, index: true },
    bookingId: { type: Schema.Types.ObjectId, ref: 'Booking' },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    lineItems: { type: [LineItemSchema], default: [] },
    subtotal: { type: Number, required: true, default: 0 },
    tax: { type: Number, required: true, default: 0 },
    total: { type: Number, required: true, default: 0 },
    status: {
      type: String,
      enum: ['draft', 'sent', 'paid'],
      default: 'draft',
    },
    dueDate: { type: Date, required: true },
    paidAt: { type: Date },
  },
  { timestamps: true }
);

export async function generateInvoiceNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const seq = await nextSequence(`invoice-${year}`);
  return `INV-AD-${year}-${String(seq).padStart(3, '0')}`;
}

export const HST_RATE = 0.13;

export function calculateTotals(lineItems: ILineItem[]): {
  subtotal: number;
  tax: number;
  total: number;
} {
  const subtotal = lineItems.reduce((sum, li) => sum + li.total, 0);
  const tax = +(subtotal * HST_RATE).toFixed(2);
  const total = +(subtotal + tax).toFixed(2);
  return { subtotal: +subtotal.toFixed(2), tax, total };
}

const Invoice =
  (models.Invoice as mongoose.Model<IInvoice>) || model<IInvoice>('Invoice', InvoiceSchema);

export default Invoice;
