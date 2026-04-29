'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { SERVICES, getServiceById } from '@/lib/services';
import { StatusBadge } from '../_components/StatusBadge';

type Booking = {
  _id: string;
  bookingRef: string;
  service: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  timeSlot: string;
  status: string;
  paymentStatus: string;
};

export default function BookingsListPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [serviceFilter, setServiceFilter] = useState<string>('all');
  const [from, setFrom] = useState<string>('');
  const [to, setTo] = useState<string>('');

  useEffect(() => {
    fetch('/api/bookings')
      .then((r) => r.json())
      .then((d) => setBookings(d.bookings || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      if (statusFilter !== 'all' && b.status !== statusFilter) return false;
      if (serviceFilter !== 'all' && b.service !== serviceFilter) return false;
      if (from) {
        if (new Date(b.date) < new Date(from)) return false;
      }
      if (to) {
        const end = new Date(to);
        end.setHours(23, 59, 59, 999);
        if (new Date(b.date) > end) return false;
      }
      return true;
    });
  }, [bookings, statusFilter, serviceFilter, from, to]);

  async function cancelBooking(id: string) {
    if (!confirm('Cancel this booking?')) return;
    const res = await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setBookings((prev) => prev.map((b) => (b._id === id ? { ...b, status: 'cancelled' } : b)));
    }
  }

  async function sendReminder(id: string) {
    const res = await fetch('/api/send-confirmation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingId: id }),
    });
    const data = await res.json();
    alert(`Email: ${data.email || '—'}, SMS: ${data.sms || '—'}`);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Bookings</h1>
        <Link
          href="/dashboard/bookings/new"
          className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-sm font-semibold px-4 py-2 rounded-md"
        >
          + New Booking
        </Link>
      </div>

      <div className="bg-[#0d0d0d] border border-white/[0.06] rounded-xl p-4 mb-4 grid grid-cols-2 md:grid-cols-4 gap-3">
        <div>
          <label className="block text-xs uppercase tracking-wider text-white/50 mb-1">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-black border border-white/10 rounded-md px-3 py-2 text-sm"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wider text-white/50 mb-1">Service</label>
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="w-full bg-black border border-white/10 rounded-md px-3 py-2 text-sm"
          >
            <option value="all">All</option>
            {SERVICES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wider text-white/50 mb-1">From</label>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="w-full bg-black border border-white/10 rounded-md px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wider text-white/50 mb-1">To</label>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full bg-black border border-white/10 rounded-md px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="bg-[#0d0d0d] border border-white/[0.06] rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-6 text-white/50">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="p-6 text-white/50">No bookings match your filters.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-white/50 text-xs uppercase tracking-wider">
              <tr className="border-b border-white/[0.06]">
                <th className="text-left px-5 py-3">Ref</th>
                <th className="text-left px-5 py-3">Customer</th>
                <th className="text-left px-5 py-3">Service</th>
                <th className="text-left px-5 py-3">Date / Time</th>
                <th className="text-left px-5 py-3">Status</th>
                <th className="text-left px-5 py-3">Payment</th>
                <th className="text-right px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr
                  key={b._id}
                  className="border-b border-white/[0.04] hover:bg-white/[0.02]"
                >
                  <td className="px-5 py-3 text-[#2563eb]">
                    <Link href={`/dashboard/bookings/${b._id}`}>{b.bookingRef}</Link>
                  </td>
                  <td className="px-5 py-3">
                    <div>{b.customerName}</div>
                    <div className="text-xs text-white/50">{b.customerEmail}</div>
                  </td>
                  <td className="px-5 py-3 text-white/70">
                    {getServiceById(b.service)?.name ?? b.service}
                  </td>
                  <td className="px-5 py-3 text-white/70">
                    {new Date(b.date).toLocaleDateString('en-CA')} · {b.timeSlot}
                  </td>
                  <td className="px-5 py-3"><StatusBadge status={b.status} /></td>
                  <td className="px-5 py-3"><StatusBadge status={b.paymentStatus} /></td>
                  <td className="px-5 py-3 text-right">
                    <div className="inline-flex gap-2">
                      <Link
                        href={`/dashboard/bookings/${b._id}`}
                        className="text-xs px-2 py-1 rounded border border-white/10 hover:bg-white/[0.05]"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => sendReminder(b._id)}
                        className="text-xs px-2 py-1 rounded border border-white/10 hover:bg-white/[0.05]"
                      >
                        Remind
                      </button>
                      {b.status !== 'cancelled' && (
                        <button
                          onClick={() => cancelBooking(b._id)}
                          className="text-xs px-2 py-1 rounded border border-red-500/30 text-red-300 hover:bg-red-500/10"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
