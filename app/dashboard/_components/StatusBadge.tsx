export function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30',
    confirmed: 'bg-[#2563eb]/15 text-[#60a5fa] border-[#2563eb]/30',
    completed: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    cancelled: 'bg-red-500/15 text-red-300 border-red-500/30',
    unpaid: 'bg-white/5 text-white/60 border-white/10',
    paid: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    invoiced: 'bg-[#2563eb]/15 text-[#60a5fa] border-[#2563eb]/30',
    draft: 'bg-white/5 text-white/60 border-white/10',
    sent: 'bg-[#2563eb]/15 text-[#60a5fa] border-[#2563eb]/30',
  };
  return (
    <span
      className={`inline-block px-2 py-0.5 text-xs uppercase tracking-wider border rounded-md ${colors[status] || 'bg-white/5 text-white/60 border-white/10'}`}
    >
      {status}
    </span>
  );
}
