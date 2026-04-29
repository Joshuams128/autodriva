'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, dateFnsLocalizer, View, SlotInfo } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { SERVICES, getServiceById } from '@/lib/services';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './calendar.css';

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
});

type Booking = {
  _id: string;
  bookingRef: string;
  customerName: string;
  service: string;
  date: string;
  timeSlot: string;
  status: string;
};

type CalEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  service: string;
  status: string;
};

const SERVICE_COLORS: Record<string, string> = {
  detailing: '#2563eb',
  'mobile-mechanic': '#10b981',
  consultant: '#f59e0b',
  'vehicle-viewing': '#8b5cf6',
  custom: '#ef4444',
};

function parseSlotToHour(slot: string): { h: number; m: number } {
  const [time, period] = slot.split(' ');
  const [hStr, mStr] = time.split(':');
  let h = parseInt(hStr, 10);
  const m = parseInt(mStr || '0', 10);
  if (period === 'PM' && h !== 12) h += 12;
  if (period === 'AM' && h === 12) h = 0;
  return { h, m };
}

export default function CalendarPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [view, setView] = useState<View>('month');
  const [date, setDate] = useState<Date>(new Date());

  useEffect(() => {
    fetch('/api/bookings')
      .then((r) => r.json())
      .then((d) => setBookings(d.bookings || []))
      .catch(() => {});
  }, []);

  const events = useMemo<CalEvent[]>(() => {
    return bookings
      .filter((b) => b.status !== 'cancelled')
      .map((b) => {
        const day = new Date(b.date);
        const { h, m } = parseSlotToHour(b.timeSlot);
        const start = new Date(day);
        start.setHours(h, m, 0, 0);
        const end = new Date(start);
        end.setHours(end.getHours() + 1);
        return {
          id: b._id,
          title: `${b.customerName} — ${getServiceById(b.service)?.name ?? b.service}`,
          start,
          end,
          service: b.service,
          status: b.status,
        };
      });
  }, [bookings]);

  function eventStyle(event: CalEvent) {
    const color = SERVICE_COLORS[event.service] || '#2563eb';
    return {
      style: {
        backgroundColor: color,
        borderRadius: '4px',
        opacity: event.status === 'pending' ? 0.7 : 1,
        color: '#fff',
        border: '0',
        fontSize: '12px',
        padding: '2px 6px',
      },
    };
  }

  async function handleSlotSelect(slot: SlotInfo) {
    const action = window.prompt(
      `Empty slot at ${slot.start.toLocaleString()}\nType "new" to create a booking, "block" to block this time, or cancel.`,
      'new'
    );
    if (action === 'new') {
      const dateStr = slot.start.toISOString().slice(0, 10);
      router.push(`/dashboard/bookings/new?date=${dateStr}`);
    } else if (action === 'block') {
      const reason = window.prompt('Reason (optional):') || '';
      const hr = slot.start.getHours();
      const ampm = hr >= 12 ? 'PM' : 'AM';
      const display = hr % 12 || 12;
      const timeSlot = `${display}:00 ${ampm}`;
      const res = await fetch('/api/blocked-slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: slot.start, timeSlot, reason }),
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || 'Failed');
      } else {
        alert('Slot blocked.');
      }
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Calendar</h1>

      <div className="bg-[#0d0d0d] border border-white/[0.06] rounded-xl p-4 mb-4 flex flex-wrap items-center gap-4">
        {SERVICES.map((s) => (
          <div key={s.id} className="flex items-center gap-2 text-sm text-white/70">
            <span
              className="inline-block w-3 h-3 rounded-sm"
              style={{ backgroundColor: SERVICE_COLORS[s.id] }}
            />
            {s.name}
          </div>
        ))}
      </div>

      <div className="bg-[#0d0d0d] border border-white/[0.06] rounded-xl p-4">
        <div style={{ height: '720px' }}>
          <Calendar
            localizer={localizer}
            events={events}
            view={view}
            onView={setView}
            date={date}
            onNavigate={setDate}
            startAccessor="start"
            endAccessor="end"
            views={['month', 'week', 'day']}
            selectable
            onSelectEvent={(e: CalEvent) => router.push(`/dashboard/bookings/${e.id}`)}
            onSelectSlot={handleSlotSelect}
            eventPropGetter={eventStyle}
          />
        </div>
      </div>
    </div>
  );
}
