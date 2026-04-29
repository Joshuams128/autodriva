'use client';

import { useState } from 'react';

const INPUT = 'w-full bg-[#111] border border-white/10 rounded-md text-white font-inter text-sm px-4 py-[13px] outline-none transition-colors duration-200 focus:border-accent';

interface MiniFormProps {
  heading: string;
}

export function ContactFormMini({ heading }: MiniFormProps) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', time: '', msg: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, type: 'mini' }),
      });

      if (!response.ok) {
        throw new Error('Failed to send request');
      }

      setSent(true);
    } catch (err) {
      setError('Failed to send request. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface border border-white/[0.06] rounded-xl p-10">
      <h3 className="font-barlow text-[28px] font-black uppercase tracking-wide mb-7">{heading}</h3>
      {sent ? (
        <div className="text-center py-10">
          <div className="w-14 h-14 rounded-full bg-accent/[0.15] border border-accent/30 flex items-center justify-center mx-auto mb-5 text-accent">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <p className="text-[#aaa] text-[15px]">Request received! We&apos;ll be in touch soon.</p>
        </div>
      ) : (
        <form onSubmit={submit} className="grid gap-4">
          {(['name', 'email', 'phone', 'time'] as const).map(k => (
            <input
              key={k}
              placeholder={{ name: 'Name', email: 'Email', phone: 'Phone', time: 'Best Time to Call' }[k]}
              value={form[k]}
              onChange={set(k)}
              required={k !== 'time'}
              className={INPUT}
            />
          ))}
          <textarea
            placeholder="Request or message"
            value={form.msg}
            onChange={set('msg')}
            rows={3}
            className={`${INPUT} resize-y`}
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className={[
              'bg-accent text-white font-barlow text-[17px] font-bold tracking-[1.5px] uppercase px-9 py-[14px] rounded border border-accent',
              loading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer hover:shadow-[0_0_30px_rgba(30,110,244,0.45)] hover:-translate-y-px',
              'transition-all duration-200',
            ].join(' ')}
          >
            {loading ? 'Submitting…' : 'Submit Request'}
          </button>
        </form>
      )}
    </div>
  );
}

export function ContactFormFull() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', service: '', msg: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, type: 'full' }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setSent(true);
    } catch (err) {
      setError('Failed to send message. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface border border-white/[0.07] rounded-xl p-11">
      <h3 className="font-barlow text-[30px] font-black uppercase tracking-wide mb-8">Send a Message</h3>
      {sent ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-accent/[0.15] border border-accent/35 flex items-center justify-center mx-auto mb-5 text-accent">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <h4 className="font-barlow text-2xl font-black uppercase mb-2.5">Message Sent!</h4>
          <p className="text-[#666] text-[15px]">We&apos;ll get back to you within 24 hours.</p>
        </div>
      ) : (
        <form onSubmit={submit} className="grid gap-4">
          <div className="grid grid-cols-2 gap-4 max-[600px]:grid-cols-1">
            <input placeholder="Name"  value={form.name}  onChange={set('name')}  required className={INPUT} />
            <input placeholder="Email" type="email" value={form.email} onChange={set('email')} required className={INPUT} />
          </div>
          <input placeholder="Phone" value={form.phone} onChange={set('phone')} className={INPUT} />
          <select
            value={form.service}
            onChange={set('service')}
            required
            className={`${INPUT} ${form.service ? 'text-white' : 'text-[#555]'} appearance-none`}
          >
            <option value="" disabled>Service Interest</option>
            {['Inventory', 'Detailing', 'Mobile Mechanic', 'Consultation', 'Other'].map(o => (
              <option key={o} value={o} className="bg-[#111]">{o}</option>
            ))}
          </select>
          <textarea
            placeholder="Message"
            value={form.msg}
            onChange={set('msg')}
            rows={4}
            className={`${INPUT} resize-y`}
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className={[
              'bg-accent text-white font-barlow text-lg font-black tracking-[2px] uppercase',
              'py-4 rounded-md border border-accent transition-all duration-200',
              'hover:shadow-[0_0_30px_rgba(30,110,244,0.45)]',
              loading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer',
            ].join(' ')}
          >
            {loading ? 'Sending…' : 'Send Message'}
          </button>
        </form>
      )}
    </div>
  );
}
