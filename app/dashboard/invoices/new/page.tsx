'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getServiceById } from '@/lib/services';

type Booking = {
  _id: string;
  bookingRef: string;
  customerName: string;
  customerEmail: string;
  service: string;
  status: string;
};

type LineItem = { description: string; quantity: number; unitPrice: number };

const HST = 0.13;

export default function NewInvoicePage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingId, setBookingId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [items, setItems] = useState<LineItem[]>([{ description: '', quantity: 1, unitPrice: 0 }]);
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().slice(0, 10);
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch('/api/bookings')
      .then((r) => r.json())
      .then((d) => setBookings((d.bookings || []).filter((b: Booking) => b.status === 'completed')))
      .catch(() => {});
  }, []);

  function pickBooking(id: string) {
    setBookingId(id);
    if (!id) return;
    const b = bookings.find((x) => x._id === id);
    if (!b) return;
    setCustomerName(b.customerName);
    setCustomerEmail(b.customerEmail);
    const svc = getServiceById(b.service);
    setItems([
      {
        description: svc?.name ?? b.service,
        quantity: 1,
        unitPrice: svc?.price ?? 0,
      },
    ]);
  }

  const totals = useMemo(() => {
    const subtotal = items.reduce((s, it) => s + (Number(it.quantity) || 0) * (Number(it.unitPrice) || 0), 0);
    const tax = subtotal * HST;
    return { subtotal, tax, total: subtotal + tax };
  }, [items]);

  async function submit(send: boolean) {
    setSubmitting(true);
    try {
      const lineItems = items.map((it) => ({
        ...it,
        total: (Number(it.quantity) || 0) * (Number(it.unitPrice) || 0),
      }));
      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: bookingId || undefined,
          customerName,
          customerEmail,
          lineItems,
          dueDate,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Failed');
        return;
      }
      const newId = data.invoice?._id;
      if (send && newId) {
        await fetch(`/api/invoices/${newId}/send`, { method: 'POST' });
      }
      router.push(`/dashboard/invoices/${newId}`);
    } finally {
      setSubmitting(false);
    }
  }

  const inputCls =
    'w-full bg-black border border-white/10 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#2563eb]';

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">New Invoice</h1>

      <div className="bg-[#0d0d0d] border border-white/[0.06] rounded-xl p-6">
        <div className="mb-5">
          <label className="block text-xs uppercase tracking-wider text-white/60 mb-1">
            Link to Completed Booking (optional)
          </label>
          <select
            value={bookingId}
            onChange={(e) => pickBooking(e.target.value)}
            className={inputCls}
          >
            <option value="">— None —</option>
            {bookings.map((b) => (
              <option key={b._id} value={b._id}>
                {b.bookingRef} — {b.customerName} ({getServiceById(b.service)?.name})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          <div>
            <label className="block text-xs uppercase tracking-wider text-white/60 mb-1">
              Customer Name
            </label>
            <input
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-white/60 mb-1">
              Customer Email
            </label>
            <input
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className={inputCls}
            />
          </div>
        </div>

        <div className="mb-2">
          <label className="block text-xs uppercase tracking-wider text-white/60 mb-1">
            Line Items
          </label>
        </div>
        <div className="space-y-2 mb-4">
          {items.map((it, i) => (
            <div
              key={i}
              className="grid grid-cols-12 gap-2 items-center bg-black/40 rounded-md p-2 border border-white/[0.06]"
            >
              <input
                placeholder="Description"
                value={it.description}
                onChange={(e) =>
                  setItems((prev) =>
                    prev.map((x, idx) => (idx === i ? { ...x, description: e.target.value } : x))
                  )
                }
                className={`${inputCls} col-span-6`}
              />
              <input
                type="number"
                placeholder="Qty"
                value={it.quantity}
                onChange={(e) =>
                  setItems((prev) =>
                    prev.map((x, idx) =>
                      idx === i ? { ...x, quantity: Number(e.target.value) || 0 } : x
                    )
                  )
                }
                className={`${inputCls} col-span-2`}
              />
              <input
                type="number"
                placeholder="Unit $"
                value={it.unitPrice}
                onChange={(e) =>
                  setItems((prev) =>
                    prev.map((x, idx) =>
                      idx === i ? { ...x, unitPrice: Number(e.target.value) || 0 } : x
                    )
                  )
                }
                className={`${inputCls} col-span-2`}
              />
              <div className="col-span-1 text-sm text-white/70 text-right">
                ${((Number(it.quantity) || 0) * (Number(it.unitPrice) || 0)).toFixed(2)}
              </div>
              <button
                type="button"
                onClick={() => setItems((prev) => prev.filter((_, idx) => idx !== i))}
                className="col-span-1 text-xs text-red-300 hover:text-red-400"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() =>
            setItems((prev) => [...prev, { description: '', quantity: 1, unitPrice: 0 }])
          }
          className="text-sm text-[#2563eb] hover:underline mb-5"
        >
          + Add line item
        </button>

        <div className="border-t border-white/[0.06] pt-4 space-y-1 text-sm text-white/80 max-w-xs ml-auto">
          <div className="flex justify-between"><span>Subtotal</span><span>${totals.subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>HST (13%)</span><span>${totals.tax.toFixed(2)}</span></div>
          <div className="flex justify-between text-lg font-bold text-[#2563eb] pt-1 border-t border-white/[0.06] mt-1">
            <span>Total</span><span>${totals.total.toFixed(2)}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
          <div>
            <label className="block text-xs uppercase tracking-wider text-white/60 mb-1">
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className={inputCls}
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={() => submit(false)}
            disabled={submitting}
            className="bg-white/[0.05] hover:bg-white/[0.08] text-white border border-white/10 px-5 py-2 rounded-md text-sm"
          >
            Save as Draft
          </button>
          <button
            type="button"
            onClick={() => submit(true)}
            disabled={submitting}
            className="bg-[#2563eb] hover:bg-[#1d4ed8] disabled:opacity-50 text-white font-semibold px-5 py-2 rounded-md text-sm"
          >
            {submitting ? 'Sending…' : 'Save & Send Email'}
          </button>
        </div>
      </div>
    </div>
  );
}
