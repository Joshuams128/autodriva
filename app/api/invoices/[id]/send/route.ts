import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { Resend } from 'resend';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Invoice from '@/models/Invoice';

type Ctx = { params: Promise<{ id: string }> };

function fmtMoney(n: number) {
  return `$${n.toFixed(2)}`;
}

function buildInvoiceEmailHtml(invoice: {
  invoiceNumber: string;
  customerName: string;
  lineItems: { description: string; quantity: number; unitPrice: number; total: number }[];
  subtotal: number;
  tax: number;
  total: number;
  dueDate: Date;
}) {
  const rows = invoice.lineItems
    .map(
      (li) => `
      <tr>
        <td style="padding:12px 14px;border-bottom:1px solid #1f1f1f;color:#e5e5e5;">${li.description}</td>
        <td style="padding:12px 14px;border-bottom:1px solid #1f1f1f;color:#bbb;text-align:center;">${li.quantity}</td>
        <td style="padding:12px 14px;border-bottom:1px solid #1f1f1f;color:#bbb;text-align:right;">${fmtMoney(li.unitPrice)}</td>
        <td style="padding:12px 14px;border-bottom:1px solid #1f1f1f;color:#fff;text-align:right;">${fmtMoney(li.total)}</td>
      </tr>`
    )
    .join('');

  const dueDateStr = new Date(invoice.dueDate).toLocaleDateString('en-CA');

  return `
  <div style="background:#0a0a0a;color:#fff;font-family:Arial,sans-serif;padding:32px;">
    <div style="max-width:640px;margin:0 auto;background:#111;border:1px solid #1f1f1f;border-radius:12px;overflow:hidden;">
      <div style="padding:24px 28px;border-bottom:1px solid #1f1f1f;display:flex;justify-content:space-between;align-items:center;">
        <div style="font-size:22px;font-weight:800;color:#fff;letter-spacing:1px;">AUTODRIVA</div>
        <div style="color:#2563eb;font-weight:700;">${invoice.invoiceNumber}</div>
      </div>
      <div style="padding:24px 28px;">
        <p style="margin:0 0 4px;color:#bbb;">Hello ${invoice.customerName},</p>
        <p style="margin:0 0 18px;color:#bbb;">Please find your invoice below.</p>
        <table style="width:100%;border-collapse:collapse;margin-top:14px;">
          <thead>
            <tr style="background:#0d0d0d;">
              <th style="padding:10px 14px;text-align:left;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Description</th>
              <th style="padding:10px 14px;text-align:center;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Qty</th>
              <th style="padding:10px 14px;text-align:right;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Unit</th>
              <th style="padding:10px 14px;text-align:right;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Total</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
        <div style="margin-top:22px;border-top:1px solid #1f1f1f;padding-top:14px;color:#ccc;">
          <div style="display:flex;justify-content:space-between;padding:4px 0;"><span>Subtotal</span><span>${fmtMoney(invoice.subtotal)}</span></div>
          <div style="display:flex;justify-content:space-between;padding:4px 0;"><span>HST (13%)</span><span>${fmtMoney(invoice.tax)}</span></div>
          <div style="display:flex;justify-content:space-between;padding:8px 0;font-size:18px;font-weight:700;color:#2563eb;border-top:1px solid #1f1f1f;margin-top:6px;"><span>Total</span><span>${fmtMoney(invoice.total)}</span></div>
        </div>
        <p style="margin-top:22px;color:#888;font-size:13px;">Due date: <strong style="color:#fff;">${dueDateStr}</strong></p>
      </div>
      <div style="padding:18px 28px;background:#0d0d0d;color:#666;font-size:12px;text-align:center;">
        Thank you for choosing AutoDriva.
      </div>
    </div>
  </div>`;
}

export async function POST(_req: NextRequest, { params }: Ctx) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await params;
    await connectDB();
    const invoice = await Invoice.findById(id).lean();
    if (!invoice) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL;
    if (!apiKey || !fromEmail) {
      return NextResponse.json(
        { error: 'Resend not configured (RESEND_API_KEY / RESEND_FROM_EMAIL)' },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);

    const html = buildInvoiceEmailHtml({
      invoiceNumber: invoice.invoiceNumber,
      customerName: invoice.customerName,
      lineItems: invoice.lineItems,
      subtotal: invoice.subtotal,
      tax: invoice.tax,
      total: invoice.total,
      dueDate: invoice.dueDate,
    });

    const { error } = await resend.emails.send({
      from: fromEmail,
      to: invoice.customerEmail,
      subject: `Invoice ${invoice.invoiceNumber} from AutoDriva`,
      html,
    });

    if (error) {
      console.error('Resend send error:', error);
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }

    await Invoice.findByIdAndUpdate(id, { status: 'sent' });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('POST /api/invoices/[id]/send error:', err);
    return NextResponse.json({ error: 'Failed to send invoice' }, { status: 500 });
  }
}
