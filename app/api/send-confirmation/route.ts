import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { Resend } from 'resend';
import twilio from 'twilio';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { getServiceById } from '@/lib/services';

function buildEmailHtml(args: {
  customerName: string;
  bookingRef: string;
  serviceName: string;
  date: string;
  timeSlot: string;
}) {
  return `
  <div style="background:#0a0a0a;color:#fff;font-family:Arial,sans-serif;padding:32px;">
    <div style="max-width:560px;margin:0 auto;background:#111;border:1px solid #1f1f1f;border-radius:12px;overflow:hidden;">
      <div style="padding:24px 28px;border-bottom:1px solid #1f1f1f;">
        <div style="font-size:22px;font-weight:800;color:#fff;letter-spacing:1px;">AUTODRIVA</div>
      </div>
      <div style="padding:24px 28px;">
        <p style="margin:0 0 12px;color:#bbb;">Hi ${args.customerName},</p>
        <p style="margin:0 0 18px;color:#bbb;">Your booking is confirmed.</p>
        <div style="background:#0d0d0d;border:1px solid #1f1f1f;border-radius:8px;padding:14px 18px;margin:14px 0;">
          <p style="margin:6px 0;color:#ccc;"><strong style="color:#2563eb;">Reference:</strong> ${args.bookingRef}</p>
          <p style="margin:6px 0;color:#ccc;"><strong style="color:#2563eb;">Service:</strong> ${args.serviceName}</p>
          <p style="margin:6px 0;color:#ccc;"><strong style="color:#2563eb;">Date:</strong> ${args.date}</p>
          <p style="margin:6px 0;color:#ccc;"><strong style="color:#2563eb;">Time:</strong> ${args.timeSlot}</p>
        </div>
        <p style="margin-top:14px;color:#888;font-size:13px;">We'll be in touch with any next steps. Reply to this email if you need to reschedule.</p>
      </div>
      <div style="padding:18px 28px;background:#0d0d0d;color:#666;font-size:12px;text-align:center;">
        AutoDriva — More Than A Ride.
      </div>
    </div>
  </div>`;
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { bookingId } = await req.json();
    if (!bookingId) {
      return NextResponse.json({ error: 'bookingId required' }, { status: 400 });
    }

    await connectDB();
    const booking = await Booking.findById(bookingId).lean();
    if (!booking) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const svc = getServiceById(booking.service);
    const serviceName = svc?.name ?? booking.service;
    const dateStr = new Date(booking.date).toLocaleDateString('en-CA');

    const result: { email?: 'sent' | 'skipped' | 'failed'; sms?: 'sent' | 'skipped' | 'failed'; error?: string } = {};

    const resendKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL;
    if (resendKey && fromEmail) {
      try {
        const resend = new Resend(resendKey);
        const { error } = await resend.emails.send({
          from: fromEmail,
          to: booking.customerEmail,
          subject: `Your AutoDriva booking — ${booking.bookingRef}`,
          html: buildEmailHtml({
            customerName: booking.customerName,
            bookingRef: booking.bookingRef,
            serviceName,
            date: dateStr,
            timeSlot: booking.timeSlot,
          }),
        });
        result.email = error ? 'failed' : 'sent';
      } catch (e) {
        console.error('Resend error:', e);
        result.email = 'failed';
      }
    } else {
      result.email = 'skipped';
    }

    const sid = process.env.TWILIO_ACCOUNT_SID;
    const token = process.env.TWILIO_AUTH_TOKEN;
    const fromPhone = process.env.TWILIO_PHONE_NUMBER;
    if (sid && token && fromPhone) {
      try {
        const client = twilio(sid, token);
        await client.messages.create({
          from: fromPhone,
          to: booking.customerPhone,
          body: `Hi ${booking.customerName}, your AutoDriva ${serviceName} is booked for ${dateStr} at ${booking.timeSlot}. Ref: ${booking.bookingRef}`,
        });
        result.sms = 'sent';
      } catch (e) {
        console.error('Twilio error:', e);
        result.sms = 'failed';
      }
    } else {
      result.sms = 'skipped';
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error('POST /api/send-confirmation error:', err);
    return NextResponse.json({ error: 'Failed to send confirmation' }, { status: 500 });
  }
}
