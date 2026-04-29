import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await params;
    await connectDB();
    const booking = await Booking.findById(id).lean();
    if (!booking) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ booking });
  } catch (err) {
    console.error('GET /api/bookings/[id] error:', err);
    return NextResponse.json({ error: 'Failed to fetch booking' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await params;
    const body = await req.json();
    const allowed: Record<string, unknown> = {};
    if (body.status) allowed.status = body.status;
    if (body.paymentStatus) allowed.paymentStatus = body.paymentStatus;
    if (typeof body.notes === 'string') allowed.notes = body.notes;

    await connectDB();
    const booking = await Booking.findByIdAndUpdate(id, allowed, { new: true }).lean();
    if (!booking) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ booking });
  } catch (err) {
    console.error('PATCH /api/bookings/[id] error:', err);
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await params;
    await connectDB();
    const booking = await Booking.findByIdAndUpdate(
      id,
      { status: 'cancelled' },
      { new: true }
    ).lean();
    if (!booking) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ booking });
  } catch (err) {
    console.error('DELETE /api/bookings/[id] error:', err);
    return NextResponse.json({ error: 'Failed to cancel booking' }, { status: 500 });
  }
}
