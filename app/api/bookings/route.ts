import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Booking, { generateBookingRef } from '@/models/Booking';
import { getServiceById } from '@/lib/services';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();
    const bookings = await Booking.find({}).sort({ date: -1 }).lean();
    return NextResponse.json({ bookings });
  } catch (err) {
    console.error('GET /api/bookings error:', err);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const {
      service,
      customerName,
      customerEmail,
      customerPhone,
      date,
      timeSlot,
      notes,
      vehicleInfo,
      status,
      paymentType,
    } = body;

    if (!service || !customerName || !customerEmail || !customerPhone || !date || !timeSlot) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const svc = getServiceById(service);
    if (!svc) return NextResponse.json({ error: 'Invalid service' }, { status: 400 });

    await connectDB();

    const bookingRef = await generateBookingRef();

    const booking = await Booking.create({
      bookingRef,
      service,
      customerName,
      customerEmail,
      customerPhone,
      date: new Date(date),
      timeSlot,
      notes,
      vehicleInfo,
      status: status || 'pending',
      paymentType: paymentType || svc.paymentType,
      paymentStatus: svc.paymentType === 'free' ? 'paid' : 'unpaid',
    });

    return NextResponse.json({ bookingRef, booking }, { status: 201 });
  } catch (err) {
    console.error('POST /api/bookings error:', err);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}
