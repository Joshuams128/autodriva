'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import BlueBtn from '@/components/BlueBtn';
import { PKGS } from '@/lib/data';

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 12" width="14" height="11" fill="none" className="flex-shrink-0 mt-[3px]">
      <path d="M1 6l4 4L15 1" stroke="#1e6ef4" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function PkgCard({ pkg }: { pkg: typeof PKGS[number] }) {
  return (
    <div
      className={[
        'relative rounded-[10px] p-9 transition-all duration-300 border',
        pkg.featured
          ? 'border-accent shadow-[0_20px_60px_rgba(30,110,244,0.18)] -translate-y-2'
          : 'border-white/[0.07] hover:border-accent/30 hover:-translate-y-1',
      ].join(' ')}
      style={{
        background: pkg.featured
          ? 'linear-gradient(160deg,#0a1628,#0d1d3a)'
          : '#0f0f0f',
      }}
    >
      {pkg.featured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent rounded-[20px] px-4 py-1 text-[11px] font-bold tracking-[1.5px] uppercase whitespace-nowrap">
          Most Popular
        </div>
      )}
      <h3 className={`font-barlow text-[32px] font-black uppercase tracking-wide mb-1.5 ${pkg.featured ? 'text-accent' : 'text-[#eee]'}`}>
        {pkg.name}
      </h3>
      <p className="text-[#666] text-sm mb-5 italic">{pkg.tag}</p>
      <p className="font-barlow text-[26px] font-bold text-white mb-7">{pkg.price}</p>

      <div className="border-t border-white/[0.07] pt-6 mb-8">
        {pkg.items.map(item => (
          <div key={item} className="flex items-start gap-3 mb-3">
            <CheckIcon />
            <span className="text-[#aaa] text-sm leading-[1.5]">{item}</span>
          </div>
        ))}
      </div>

      <Link href={pkg.bookingUrl || '/contact'} target={pkg.bookingUrl ? '_blank' : undefined}>
        <BlueBtn outline={!pkg.featured}>Book This Package</BlueBtn>
      </Link>
    </div>
  );
}

export default function DetailingPage() {
  useEffect(() => {
    const widget = document.getElementById('square-booking-widget');
    if (widget) {
      const script = document.createElement('script');
      script.src = 'https://app.squareup.com/appointments/buyer/widget/325xcdqpna1ef5/L3JJQK4G945KD.js';
      widget.appendChild(script);
    }
  }, []);

  return (
    <div>
      <PageHero
        title="Detailing & Tinting"
        sub="Professional detailing packages tailored to your vehicle's needs."
        img="https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=1600&q=80"
      />

      {/* Packages */}
      <section className="py-[90px] px-20 bg-base max-[600px]:px-6">
        <div className="max-w-[1140px] mx-auto">
          <div className="text-center mb-14">
            <span className="block text-accent text-[11px] font-semibold tracking-[3px] uppercase mb-3">
              Choose Your Package
            </span>
            <h2
              className="font-barlow font-black uppercase tracking-[2px]"
              style={{ fontSize: 'clamp(34px,5vw,58px)' }}
            >
              Detailing Packages
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-5 max-[900px]:grid-cols-1">
            {PKGS.map(pkg => <PkgCard key={pkg.name} pkg={pkg} />)}
          </div>
        </div>
      </section>

      {/* Book Detailing Now */}
      <section className="py-20 px-20 bg-deep border-t border-white/[0.05] max-[600px]:px-6">
        <div className="max-w-[1140px] mx-auto">
          <div className="text-center mb-12">
            <span className="block text-accent text-[11px] font-semibold tracking-[3px] uppercase mb-3">
              Ready to Refresh Your Ride?
            </span>
            <h2
              className="font-barlow font-black uppercase tracking-[2px] mb-4"
              style={{ fontSize: 'clamp(34px,5vw,56px)' }}
            >
              Book Detailing Now
            </h2>
            <p className="text-[#777] text-[15px] leading-[1.8] max-w-2xl mx-auto">
              Schedule your AutoDriva detailing appointment online. Choose your package, select your preferred date and time, and we'll have your vehicle looking pristine. Fast, convenient, and professional — all at your location.
            </p>
          </div>

          {/* Square Booking Widget */}
          <div
            id="square-booking-widget"
            className="mx-auto max-w-4xl bg-[#111] border border-white/[0.06] rounded-xl overflow-hidden"
          />
        </div>
      </section>
    </div>
  );
}
