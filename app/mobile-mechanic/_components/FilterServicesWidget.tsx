'use client';

import { useEffect } from 'react';

export default function FilterServicesWidget() {
  useEffect(() => {
    const widget = document.getElementById('square-booking-widget3');
    if (widget) {
      const script = document.createElement('script');
      script.src = 'https://app.squareup.com/appointments/buyer/widget/48da9bxyqpvh1b/L3JJQK4G945KD.js';
      widget.appendChild(script);
    }
  }, []);

  return (
    <section className="py-20 px-20 bg-deep border-t border-white/[0.05] max-[600px]:px-6">
      <div className="max-w-[1140px] mx-auto">
        <div className="text-center mb-12">
          <span className="block text-accent text-[11px] font-semibold tracking-[3px] uppercase mb-3">
            Book Your Service
          </span>
          <h2
            className="font-barlow font-black uppercase tracking-[2px] mb-4"
            style={{ fontSize: 'clamp(34px,5vw,56px)' }}
          >
            Schedule Now
          </h2>
          <p className="text-[#777] text-[15px] leading-[1.8] max-w-2xl mx-auto">
            Choose your filter service and select your preferred date and time for a convenient appointment at your location.
          </p>
        </div>

        <div
          id="square-booking-widget3"
          className="mx-auto max-w-4xl bg-[#111] border border-white/[0.06] rounded-xl overflow-hidden"
        />
      </div>
    </section>
  );
}
