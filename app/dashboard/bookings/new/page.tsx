'use client';

import { useEffect, useState, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { SERVICES, getServiceById } from '@/lib/services';

const schema = z.object({
  service: z.string().min(1, 'Select a service'),
  customerName: z.string().min(1, 'Required'),
  customerEmail: z.string().email('Invalid email'),
  customerPhone: z.string().min(7, 'Required'),
  vehicleInfo: z.string().optional(),
  date: z.string().min(1, 'Required'),
  timeSlot: z.string().min(1, 'Required'),
  notes: z.string().optional(),
  status: z.enum(['pending', 'confirmed', 'completed', 'cancelled']),
  paymentType: z.enum(['upfront', 'post-service', 'free']),
  sendConfirmation: z.boolean().optional(),
});

type FormValues = z.infer<typeof schema>;

function NewBookingForm() {
  const router = useRouter();
  const params = useSearchParams();
  const presetDate = params.get('date') || '';

  const [slots, setSlots] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      service: '',
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      vehicleInfo: '',
      date: presetDate,
      timeSlot: '',
      notes: '',
      status: 'pending',
      paymentType: 'post-service',
      sendConfirmation: true,
    },
  });

  const date = watch('date');
  const service = watch('service');

  useEffect(() => {
    if (service) {
      const svc = getServiceById(service);
      if (svc) setValue('paymentType', svc.paymentType);
    }
  }, [service, setValue]);

  useEffect(() => {
    if (!date) {
      setSlots([]);
      return;
    }
    fetch(`/api/bookings/available-slots?date=${date}`)
      .then((r) => r.json())
      .then((d) => setSlots(d.slots || []))
      .catch(() => setSlots([]));
  }, [date]);

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Failed to create booking');
        return;
      }

      if (values.sendConfirmation && data.booking?._id) {
        await fetch('/api/send-confirmation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bookingId: data.booking._id }),
        });
      }

      router.push(`/dashboard/bookings/${data.booking._id}`);
    } finally {
      setSubmitting(false);
    }
  }

  const Field = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
    <div className="mb-4">
      <label className="block text-xs uppercase tracking-wider text-white/60 mb-1">{label}</label>
      {children}
      {error && <div className="text-red-400 text-xs mt-1">{error}</div>}
    </div>
  );

  const inputCls =
    'w-full bg-black border border-white/10 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#2563eb]';

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">New Manual Booking</h1>

      <div className="bg-[#0d0d0d] border border-white/[0.06] rounded-xl p-6 max-w-3xl">
        <div
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(onSubmit)();
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <Field label="Service" error={errors.service?.message}>
              <select {...register('service')} className={inputCls}>
                <option value="">Select a service…</option>
                {SERVICES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Status" error={errors.status?.message}>
              <select {...register('status')} className={inputCls}>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </Field>

            <Field label="Customer Name" error={errors.customerName?.message}>
              <input {...register('customerName')} className={inputCls} />
            </Field>

            <Field label="Customer Email" error={errors.customerEmail?.message}>
              <input type="email" {...register('customerEmail')} className={inputCls} />
            </Field>

            <Field label="Customer Phone" error={errors.customerPhone?.message}>
              <input {...register('customerPhone')} className={inputCls} />
            </Field>

            <Field label="Vehicle Info (optional)" error={errors.vehicleInfo?.message}>
              <input {...register('vehicleInfo')} className={inputCls} />
            </Field>

            <Field label="Date" error={errors.date?.message}>
              <input type="date" {...register('date')} className={inputCls} />
            </Field>

            <Field label="Time Slot" error={errors.timeSlot?.message}>
              <select {...register('timeSlot')} className={inputCls} disabled={!slots.length}>
                <option value="">{slots.length ? 'Select a slot…' : 'Pick a date first'}</option>
                {slots.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Payment Type" error={errors.paymentType?.message}>
              <select {...register('paymentType')} className={inputCls}>
                <option value="upfront">Upfront</option>
                <option value="post-service">Post-Service</option>
                <option value="free">Free</option>
              </select>
            </Field>
          </div>

          <Field label="Notes (optional)" error={errors.notes?.message}>
            <textarea {...register('notes')} className={`${inputCls} min-h-[90px]`} />
          </Field>

          <label className="flex items-center gap-2 text-sm text-white/70 mb-5">
            <input type="checkbox" {...register('sendConfirmation')} />
            Send confirmation email + SMS after creation
          </label>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={submitting}
              className="bg-[#2563eb] hover:bg-[#1d4ed8] disabled:opacity-50 text-white font-semibold px-5 py-2 rounded-md text-sm"
            >
              {submitting ? 'Saving…' : 'Create Booking'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="bg-white/[0.04] hover:bg-white/[0.08] text-white/80 px-5 py-2 rounded-md text-sm border border-white/10"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NewBookingPage() {
  return (
    <Suspense fallback={<div className="text-white/50">Loading…</div>}>
      <NewBookingForm />
    </Suspense>
  );
}
