'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getServiceById } from '@/lib/services';
import { StatusBadge } from './_components/StatusBadge';

type BookingLite = {
  _id: string;
  bookingRef: string;
  service: string;
  customerName: string;
  date: string;
  timeSlot: string;
  status: string;
  paymentStatus: string;
};

type InvoiceLite = {
  _id: string;
  invoiceNumber: string;
  status: string;
  total: number;
};

export default function DashboardOverview() {
  const [bookings, setBookings] = useState<BookingLite[]>([]);
  const [invoices, setInvoices] = useState<InvoiceLite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/bookings').then((r) => r.json()),
      fetch('/api/invoices').then((r) => r.json()),
    ])
      .then(([b, i]) => {
        setBookings(b.bookings || []);
        setInvoices(i.invoices || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const monthBookings = bookings.filter((b) => new Date(b.date) >= monthStart);
  const pending = bookings.filter((b) => b.status === 'pending').length;
  const confirmed = bookings.filter((b) => b.status === 'confirmed').length;
  const revenue = invoices
    .filter((i) => i.status === 'paid')
    .reduce((sum, i) => sum + (i.total || 0), 0);

  const recent = [...bookings]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Overview</h1>
        <div className="flex gap-2">
          <Link
            href="/dashboard/bookings/new"
            className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-sm font-semibold px-4 py-2 rounded-md"
          >
            + New Booking
          </Link>
          <Link
            href="/dashboard/invoices/new"
            className="bg-white/[0.05] hover:bg-white/[0.08] text-white text-sm font-semibold px-4 py-2 rounded-md border border-white/10"
          >
            + New Invoice
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Bookings This Month" value={String(monthBookings.length)} />
        <StatCard label="Pending" value={String(pending)} />
        <StatCard label="Confirmed" value={String(confirmed)} />
        <StatCard label="Revenue (Paid)" value={`$${revenue.toFixed(2)}`} />
      </div>

      <div className="bg-[#0d0d0d] border border-white/[0.06] rounded-xl">
        <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
          <h2 className="font-semibold">Recent Bookings</h2>
          <Link href="/dashboard/bookings" className="text-sm text-[#2563eb] hover:underline">
            View all →
          </Link>
        </div>
        {loading ? (
          <div className="p-6 text-white/50">Loading…</div>
        ) : recent.length === 0 ? (
          <div className="p-6 text-white/50">No bookings yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-white/50 text-xs uppercase tracking-wider">
              <tr className="border-b border-white/[0.06]">
                <th className="text-left px-5 py-3">Ref</th>
                <th className="text-left px-5 py-3">Customer</th>
                <th className="text-left px-5 py-3">Service</th>
                <th className="text-left px-5 py-3">Date</th>
                <th className="text-left px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((b) => (
                <tr
                  key={b._id}
                  className="border-b border-white/[0.04] hover:bg-white/[0.02]"
                >
                  <td className="px-5 py-3 text-[#2563eb]">
                    <Link href={`/dashboard/bookings/${b._id}`}>{b.bookingRef}</Link>
                  </td>
                  <td className="px-5 py-3">{b.customerName}</td>
                  <td className="px-5 py-3 text-white/70">
                    {getServiceById(b.service)?.name ?? b.service}
                  </td>
                  <td className="px-5 py-3 text-white/70">
                    {new Date(b.date).toLocaleDateString('en-CA')} · {b.timeSlot}
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge status={b.status} />
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

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#0d0d0d] border border-white/[0.06] rounded-xl p-5">
      <div className="text-xs uppercase tracking-wider text-white/50 mb-2">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}

