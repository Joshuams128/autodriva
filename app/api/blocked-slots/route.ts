import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import BlockedSlot from '@/models/BlockedSlot';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();
    const slots = await BlockedSlot.find({}).sort({ date: 1 }).lean();
    return NextResponse.json({ slots });
  } catch (err) {
    console.error('GET /api/blocked-slots error:', err);
    return NextResponse.json({ error: 'Failed to fetch blocked slots' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { date, timeSlot, reason } = await req.json();
    if (!date || !timeSlot) {
      return NextResponse.json({ error: 'date and timeSlot required' }, { status: 400 });
    }
    await connectDB();
    const slot = await BlockedSlot.create({
      date: new Date(date),
      timeSlot,
      reason,
    });
    return NextResponse.json({ slot }, { status: 201 });
  } catch (err) {
    console.error('POST /api/blocked-slots error:', err);
    return NextResponse.json({ error: 'Failed to create blocked slot' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
    await connectDB();
    await BlockedSlot.findByIdAndDelete(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('DELETE /api/blocked-slots error:', err);
    return NextResponse.json({ error: 'Failed to delete blocked slot' }, { status: 500 });
  }
}
