'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { StatusBadge } from '../_components/StatusBadge';

type Invoice = {
  _id: string;
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  total: number;
  status: string;
  dueDate: string;
};

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/invoices')
      .then((r) => r.json())
      .then((d) => setInvoices(d.invoices || []))
      .finally(() => setLoading(false));
  }, []);

  async function send(id: string) {
    if (!confirm('Send this invoice via email?')) return;
    const res = await fetch(`/api/invoices/${id}/send`, { method: 'POST' });
    const data = await res.json();
    if (res.ok) {
      setInvoices((prev) => prev.map((i) => (i._id === id ? { ...i, status: 'sent' } : i)));
      alert('Invoice sent.');
    } else {
      alert(data.error || 'Failed to send.');
    }
  }

  async function markPaid(id: string) {
    const res = await fetch(`/api/invoices/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'paid' }),
    });
    if (res.ok) {
      setInvoices((prev) => prev.map((i) => (i._id === id ? { ...i, status: 'paid' } : i)));
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Invoices</h1>
        <Link
          href="/dashboard/invoices/new"
          className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-sm font-semibold px-4 py-2 rounded-md"
        >
          + New Invoice
        </Link>
      </div>

      <div className="bg-[#0d0d0d] border border-white/[0.06] rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-6 text-white/50">Loading…</div>
        ) : invoices.length === 0 ? (
          <div className="p-6 text-white/50">No invoices yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-white/50 text-xs uppercase tracking-wider">
              <tr className="border-b border-white/[0.06]">
                <th className="text-left px-5 py-3">Invoice</th>
                <th className="text-left px-5 py-3">Customer</th>
                <th className="text-left px-5 py-3">Due Date</th>
                <th className="text-right px-5 py-3">Total</th>
                <th className="text-left px-5 py-3 pl-6">Status</th>
                <th className="text-right px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr
                  key={inv._id}
                  className="border-b border-white/[0.04] hover:bg-white/[0.02]"
                >
                  <td className="px-5 py-3 text-[#2563eb]">
                    <Link href={`/dashboard/invoices/${inv._id}`}>{inv.invoiceNumber}</Link>
                  </td>
                  <td className="px-5 py-3">
                    <div>{inv.customerName}</div>
                    <div className="text-xs text-white/50">{inv.customerEmail}</div>
                  </td>
                  <td className="px-5 py-3 text-white/70">
                    {new Date(inv.dueDate).toLocaleDateString('en-CA')}
                  </td>
                  <td className="px-5 py-3 text-right font-semibold">
                    ${inv.total.toFixed(2)}
                  </td>
                  <td className="px-5 py-3 pl-6"><StatusBadge status={inv.status} /></td>
                  <td className="px-5 py-3 text-right">
                    <div className="inline-flex gap-2">
                      <Link
                        href={`/dashboard/invoices/${inv._id}`}
                        className="text-xs px-2 py-1 rounded border border-white/10 hover:bg-white/[0.05]"
                      >
                        View
                      </Link>
                      {inv.status !== 'paid' && (
                        <>
                          <button
                            onClick={() => send(inv._id)}
                            className="text-xs px-2 py-1 rounded border border-white/10 hover:bg-white/[0.05]"
                          >
                            Send
                          </button>
                          <button
                            onClick={() => markPaid(inv._id)}
                            className="text-xs px-2 py-1 rounded border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10"
                          >
                            Mark Paid
                          </button>
                        </>
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
