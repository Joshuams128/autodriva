import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Invoice, { calculateTotals, ILineItem } from '@/models/Invoice';
import Booking from '@/models/Booking';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await params;
    await connectDB();
    const invoice = await Invoice.findById(id).lean();
    if (!invoice) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ invoice });
  } catch (err) {
    console.error('GET /api/invoices/[id] error:', err);
    return NextResponse.json({ error: 'Failed to fetch invoice' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await params;
    const body = await req.json();
    const update: Record<string, unknown> = {};

    if (body.status) update.status = body.status;
    if (body.status === 'paid') update.paidAt = new Date();
    if (body.dueDate) update.dueDate = new Date(body.dueDate);
    if (body.customerName) update.customerName = body.customerName;
    if (body.customerEmail) update.customerEmail = body.customerEmail;

    if (Array.isArray(body.lineItems)) {
      const items: ILineItem[] = body.lineItems.map((li: ILineItem) => ({
        description: li.description,
        quantity: Number(li.quantity) || 1,
        unitPrice: Number(li.unitPrice) || 0,
        total: +(Number(li.quantity || 1) * Number(li.unitPrice || 0)).toFixed(2),
      }));
      const { subtotal, tax, total } = calculateTotals(items);
      update.lineItems = items;
      update.subtotal = subtotal;
      update.tax = tax;
      update.total = total;
    }

    await connectDB();
    const invoice = await Invoice.findByIdAndUpdate(id, update, { new: true }).lean();
    if (!invoice) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    if (body.status === 'paid' && invoice.bookingId) {
      await Booking.findByIdAndUpdate(invoice.bookingId, { paymentStatus: 'paid' });
    }

    return NextResponse.json({ invoice });
  } catch (err) {
    console.error('PATCH /api/invoices/[id] error:', err);
    return NextResponse.json({ error: 'Failed to update invoice' }, { status: 500 });
  }
}
