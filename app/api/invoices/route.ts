import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Invoice, { generateInvoiceNumber, calculateTotals, ILineItem } from '@/models/Invoice';
import Booking from '@/models/Booking';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();
    const invoices = await Invoice.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ invoices });
  } catch (err) {
    console.error('GET /api/invoices error:', err);
    return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { bookingId, lineItems, dueDate, customerName, customerEmail } = body as {
      bookingId?: string;
      lineItems?: ILineItem[];
      dueDate?: string;
      customerName?: string;
      customerEmail?: string;
    };

    await connectDB();

    let resolvedName = customerName;
    let resolvedEmail = customerEmail;

    if (bookingId) {
      const booking = await Booking.findById(bookingId).lean();
      if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
      resolvedName = resolvedName || booking.customerName;
      resolvedEmail = resolvedEmail || booking.customerEmail;
    }

    if (!resolvedName || !resolvedEmail) {
      return NextResponse.json(
        { error: 'customerName and customerEmail required (or provide bookingId)' },
        { status: 400 }
      );
    }

    const items: ILineItem[] = (lineItems || []).map((li) => ({
      description: li.description,
      quantity: Number(li.quantity) || 1,
      unitPrice: Number(li.unitPrice) || 0,
      total: +(Number(li.quantity || 1) * Number(li.unitPrice || 0)).toFixed(2),
    }));

    const { subtotal, tax, total } = calculateTotals(items);
    const invoiceNumber = await generateInvoiceNumber();

    const due = dueDate
      ? new Date(dueDate)
      : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

    const invoice = await Invoice.create({
      invoiceNumber,
      bookingId,
      customerName: resolvedName,
      customerEmail: resolvedEmail,
      lineItems: items,
      subtotal,
      tax,
      total,
      status: 'draft',
      dueDate: due,
    });

    if (bookingId) {
      await Booking.findByIdAndUpdate(bookingId, { paymentStatus: 'invoiced' });
    }

    return NextResponse.json({ invoice }, { status: 201 });
  } catch (err) {
    console.error('POST /api/invoices error:', err);
    return NextResponse.json({ error: 'Failed to create invoice' }, { status: 500 });
  }
}
