'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { StatusBadge } from '../../_components/StatusBadge';

type Invoice = {
  _id: string;
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  lineItems: { description: string; quantity: number; unitPrice: number; total: number }[];
  subtotal: number;
  tax: number;
  total: number;
  status: string;
  dueDate: string;
  paidAt?: string;
  createdAt: string;
};

export default function InvoiceDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch(`/api/invoices/${id}`)
      .then((r) => r.json())
      .then((d) => setInvoice(d.invoice))
      .finally(() => setLoading(false));
  }, [id]);

  async function send() {
    setBusy(true);
    try {
      const res = await fetch(`/api/invoices/${id}/send`, { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setInvoice((inv) => (inv ? { ...inv, status: 'sent' } : inv));
        alert('Sent.');
      } else {
        alert(data.error || 'Failed to send');
      }
    } finally {
      setBusy(false);
    }
  }

  async function markPaid() {
    setBusy(true);
    try {
      const res = await fetch(`/api/invoices/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'paid' }),
      });
      const data = await res.json();
      if (res.ok) setInvoice(data.invoice);
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <div className="text-white/50">Loading…</div>;
  if (!invoice) return <div className="text-white/50">Invoice not found.</div>;

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6 print:hidden">
        <Link href="/dashboard/invoices" className="text-sm text-white/50 hover:text-white">
          ← Back to invoices
        </Link>
        <div className="flex gap-2">
          {invoice.status !== 'paid' && (
            <>
              <button
                onClick={send}
                disabled={busy}
                className="bg-white/[0.05] hover:bg-white/[0.08] text-sm border border-white/10 px-4 py-2 rounded-md"
              >
                Send via Email
              </button>
              <button
                onClick={markPaid}
                disabled={busy}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 rounded-md"
              >
                Mark as Paid
              </button>
            </>
          )}
          <button
            onClick={() => window.print()}
            className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-sm font-semibold px-4 py-2 rounded-md"
          >
            Print / Download
          </button>
        </div>
      </div>

      <div className="bg-[#0d0d0d] border border-white/[0.06] rounded-xl p-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="text-2xl font-bold tracking-wider">AUTODRIVA</div>
            <div className="text-xs uppercase tracking-wider text-white/50 mt-1">Invoice</div>
          </div>
          <div className="text-right">
            <div className="text-[#2563eb] font-bold text-lg">{invoice.invoiceNumber}</div>
            <div className="mt-1"><StatusBadge status={invoice.status} /></div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6 text-sm">
          <div>
            <div className="text-white/50 text-xs uppercase tracking-wider mb-1">Bill To</div>
            <div className="text-white font-medium">{invoice.customerName}</div>
            <div className="text-white/70">{invoice.customerEmail}</div>
          </div>
          <div className="text-right">
            <div className="text-white/50 text-xs uppercase tracking-wider mb-1">Due Date</div>
            <div className="text-white font-medium">
              {new Date(invoice.dueDate).toLocaleDateString('en-CA')}
            </div>
            {invoice.paidAt && (
              <>
                <div className="text-white/50 text-xs uppercase tracking-wider mt-3 mb-1">Paid</div>
                <div className="text-emerald-400 font-medium">
                  {new Date(invoice.paidAt).toLocaleDateString('en-CA')}
                </div>
              </>
            )}
          </div>
        </div>

        <table className="w-full text-sm mb-6">
          <thead className="text-white/50 text-xs uppercase tracking-wider">
            <tr className="border-b border-white/[0.08]">
              <th className="text-left py-2">Description</th>
              <th className="text-center py-2">Qty</th>
              <th className="text-right py-2">Unit Price</th>
              <th className="text-right py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.lineItems.map((li, i) => (
              <tr key={i} className="border-b border-white/[0.04]">
                <td className="py-3">{li.description}</td>
                <td className="py-3 text-center text-white/70">{li.quantity}</td>
                <td className="py-3 text-right text-white/70">${li.unitPrice.toFixed(2)}</td>
                <td className="py-3 text-right font-medium">${li.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="ml-auto max-w-xs space-y-1 text-sm">
          <div className="flex justify-between text-white/70">
            <span>Subtotal</span><span>${invoice.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-white/70">
            <span>HST (13%)</span><span>${invoice.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold text-[#2563eb] border-t border-white/[0.08] pt-2 mt-2">
            <span>Total</span><span>${invoice.total.toFixed(2)}</span>
          </div>
        </div>

        <div className="text-center text-white/40 text-xs mt-10">
          Thank you for choosing AutoDriva.
        </div>
      </div>
    </div>
  );
}
