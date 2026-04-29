'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getServiceById } from '@/lib/services';
import { StatusBadge } from '../../_components/StatusBadge';

type Booking = {
  _id: string;
  bookingRef: string;
  service: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  timeSlot: string;
  notes?: string;
  status: string;
  paymentType: string;
  paymentStatus: string;
  vehicleInfo?: string;
  createdAt: string;
};

export default function BookingDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch(`/api/bookings/${id}`)
      .then((r) => r.json())
      .then((d) => setBooking(d.booking))
      .finally(() => setLoading(false));
  }, [id]);

  async function update(patch: Partial<Booking>) {
    setBusy(true);
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      });
      const data = await res.json();
      if (res.ok) setBooking(data.booking);
    } finally {
      setBusy(false);
    }
  }

  async function cancel() {
    if (!confirm('Cancel this booking?')) return;
    await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
    setBooking((b) => (b ? { ...b, status: 'cancelled' } : b));
  }

  async function generateInvoice() {
    if (!booking) return;
    const svc = getServiceById(booking.service);
    const res = await fetch('/api/invoices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bookingId: booking._id,
        lineItems: [
          {
            description: svc?.name ?? booking.service,
            quantity: 1,
            unitPrice: svc?.price ?? 0,
            total: svc?.price ?? 0,
          },
        ],
      }),
    });
    const data = await res.json();
    if (res.ok && data.invoice?._id) {
      router.push(`/dashboard/invoices/${data.invoice._id}`);
    } else {
      alert(data.error || 'Failed to create invoice');
    }
  }

  async function sendReminder() {
    setBusy(true);
    try {
      const res = await fetch('/api/send-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId: id }),
      });
      const data = await res.json();
      alert(`Email: ${data.email || '—'}, SMS: ${data.sms || '—'}`);
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <div className="text-white/50">Loading…</div>;
  if (!booking) return <div className="text-white/50">Booking not found.</div>;

  const svc = getServiceById(booking.service);

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/dashboard/bookings" className="text-sm text-white/50 hover:text-white">
            ← Back to bookings
          </Link>
          <h1 className="text-2xl font-bold mt-1">{booking.bookingRef}</h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={sendReminder}
            disabled={busy}
            className="bg-white/[0.05] hover:bg-white/[0.08] text-sm px-4 py-2 rounded-md border border-white/10"
          >
            Send Reminder
          </button>
          {booking.paymentType === 'post-service' && booking.paymentStatus !== 'paid' && (
            <button
              onClick={generateInvoice}
              className="bg-[#2563eb] hover:bg-[#1d4ed8] text-sm font-semibold px-4 py-2 rounded-md"
            >
              Generate Invoice
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-[#0d0d0d] border border-white/[0.06] rounded-xl p-6">
          <h2 className="font-semibold mb-4">Customer</h2>
          <Row label="Name" value={booking.customerName} />
          <Row label="Email" value={booking.customerEmail} />
          <Row label="Phone" value={booking.customerPhone} />
          <Row label="Vehicle" value={booking.vehicleInfo || '—'} />

          <h2 className="font-semibold mt-6 mb-4">Service</h2>
          <Row label="Service" value={svc?.name ?? booking.service} />
          <Row
            label="Date / Time"
            value={`${new Date(booking.date).toLocaleDateString('en-CA')} · ${booking.timeSlot}`}
          />
          <Row label="Notes" value={booking.notes || '—'} />
        </div>

        <div className="bg-[#0d0d0d] border border-white/[0.06] rounded-xl p-6">
          <h2 className="font-semibold mb-4">Status</h2>

          <div className="mb-4">
            <label className="block text-xs uppercase tracking-wider text-white/50 mb-2">
              Booking Status
            </label>
            <select
              value={booking.status}
              onChange={(e) => update({ status: e.target.value })}
              disabled={busy}
              className="w-full bg-black border border-white/10 rounded-md px-3 py-2 text-sm"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <div className="mt-2"><StatusBadge status={booking.status} /></div>
          </div>

          <div className="mb-4">
            <label className="block text-xs uppercase tracking-wider text-white/50 mb-2">
              Payment Status
            </label>
            <select
              value={booking.paymentStatus}
              onChange={(e) => update({ paymentStatus: e.target.value })}
              disabled={busy}
              className="w-full bg-black border border-white/10 rounded-md px-3 py-2 text-sm"
            >
              <option value="unpaid">Unpaid</option>
              <option value="invoiced">Invoiced</option>
              <option value="paid">Paid</option>
            </select>
            <div className="mt-2"><StatusBadge status={booking.paymentStatus} /></div>
          </div>

          <div className="mb-2 text-xs text-white/50">
            Created: {new Date(booking.createdAt).toLocaleString()}
          </div>

          {booking.status !== 'cancelled' && (
            <button
              onClick={cancel}
              className="mt-4 w-full text-sm border border-red-500/30 text-red-300 hover:bg-red-500/10 rounded-md py-2"
            >
              Cancel Booking
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-white/[0.04] py-2 text-sm">
      <span className="text-white/50">{label}</span>
      <span className="text-white text-right">{value}</span>
    </div>
  );
}
