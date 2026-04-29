'use client';

import { useEffect, useState } from 'react';

const DEFAULT_SLOTS = [
  '9:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '1:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
];

type Blocked = {
  _id: string;
  date: string;
  timeSlot: string;
  reason?: string;
};

export default function SettingsPage() {
  const [blocked, setBlocked] = useState<Blocked[]>([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState(DEFAULT_SLOTS[0]);
  const [reason, setReason] = useState('');

  useEffect(() => {
    fetch('/api/blocked-slots')
      .then((r) => r.json())
      .then((d) => setBlocked(d.slots || []))
      .finally(() => setLoading(false));
  }, []);

  async function addBlocked() {
    if (!date) return alert('Pick a date');
    const res = await fetch('/api/blocked-slots', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, timeSlot, reason }),
    });
    const data = await res.json();
    if (res.ok) {
      setBlocked((prev) => [...prev, data.slot]);
      setReason('');
    } else {
      alert(data.error || 'Failed');
    }
  }

  async function removeBlocked(id: string) {
    const res = await fetch(`/api/blocked-slots?id=${id}`, { method: 'DELETE' });
    if (res.ok) setBlocked((prev) => prev.filter((b) => b._id !== id));
  }

  const inputCls =
    'w-full bg-black border border-white/10 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#2563eb]';

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <section className="bg-[#0d0d0d] border border-white/[0.06] rounded-xl p-6 mb-6">
        <h2 className="font-semibold mb-1">Booking Hours</h2>
        <p className="text-sm text-white/50 mb-4">
          Default time slots are 9 AM – 5 PM in 1-hour blocks.
        </p>
        <div className="flex flex-wrap gap-2">
          {DEFAULT_SLOTS.map((s) => (
            <span
              key={s}
              className="text-xs px-3 py-1.5 rounded-md bg-white/[0.04] border border-white/10 text-white/80"
            >
              {s}
            </span>
          ))}
        </div>
        <p className="text-xs text-white/40 mt-3">
          Editing default booking hours is planned for a future update.
        </p>
      </section>

      <section className="bg-[#0d0d0d] border border-white/[0.06] rounded-xl p-6 mb-6">
        <h2 className="font-semibold mb-4">Block a Time Slot</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
          <div>
            <label className="block text-xs uppercase tracking-wider text-white/60 mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-white/60 mb-1">Time</label>
            <select
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              className={inputCls}
            >
              {DEFAULT_SLOTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-white/60 mb-1">Reason</label>
            <input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className={inputCls}
              placeholder="optional"
            />
          </div>
        </div>
        <button
          onClick={addBlocked}
          className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold text-sm px-4 py-2 rounded-md"
        >
          Block Slot
        </button>
      </section>

      <section className="bg-[#0d0d0d] border border-white/[0.06] rounded-xl">
        <div className="px-5 py-4 border-b border-white/[0.06]">
          <h2 className="font-semibold">Blocked Slots</h2>
        </div>
        {loading ? (
          <div className="p-6 text-white/50">Loading…</div>
        ) : blocked.length === 0 ? (
          <div className="p-6 text-white/50">No blocked slots.</div>
        ) : (
          <ul>
            {blocked.map((b) => (
              <li
                key={b._id}
                className="flex items-center justify-between px-5 py-3 border-b border-white/[0.04] text-sm"
              >
                <div>
                  <span className="text-white">{new Date(b.date).toLocaleDateString('en-CA')}</span>
                  <span className="text-white/50 mx-2">·</span>
                  <span className="text-white">{b.timeSlot}</span>
                  {b.reason && <span className="text-white/50 ml-3">({b.reason})</span>}
                </div>
                <button
                  onClick={() => removeBlocked(b._id)}
                  className="text-xs px-2 py-1 rounded border border-red-500/30 text-red-300 hover:bg-red-500/10"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="bg-[#0d0d0d] border border-white/[0.06] rounded-xl p-6 mt-6">
        <h2 className="font-semibold mb-1">Admin Email</h2>
        <p className="text-sm text-white/50">
          Currently configured via the <code className="bg-white/[0.05] px-1 rounded">ADMIN_EMAIL</code>{' '}
          environment variable. DB-based admin management coming in a future update.
        </p>
      </section>
    </div>
  );
}
