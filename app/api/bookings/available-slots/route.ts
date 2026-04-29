import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import BlockedSlot from '@/models/BlockedSlot';

const DEFAULT_SLOTS = [
  '9:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '1:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const dateStr = searchParams.get('date');
    if (!dateStr) {
      return NextResponse.json({ error: 'date query param is required' }, { status: 400 });
    }

    const day = new Date(dateStr);
    if (isNaN(day.getTime())) {
      return NextResponse.json({ error: 'Invalid date' }, { status: 400 });
    }

    const start = new Date(day);
    start.setHours(0, 0, 0, 0);
    const end = new Date(day);
    end.setHours(23, 59, 59, 999);

    await connectDB();

    const [bookings, blocked] = await Promise.all([
      Booking.find({
        date: { $gte: start, $lte: end },
        status: { $ne: 'cancelled' },
      })
        .select('timeSlot')
        .lean(),
      BlockedSlot.find({ date: { $gte: start, $lte: end } })
        .select('timeSlot')
        .lean(),
    ]);

    const taken = new Set([
      ...bookings.map((b) => b.timeSlot),
      ...blocked.map((b) => b.timeSlot),
    ]);

    const available = DEFAULT_SLOTS.filter((s) => !taken.has(s));

    return NextResponse.json({ slots: available, all: DEFAULT_SLOTS, taken: Array.from(taken) });
  } catch (err) {
    console.error('GET /api/bookings/available-slots error:', err);
    return NextResponse.json({ error: 'Failed to fetch slots' }, { status: 500 });
  }
}
