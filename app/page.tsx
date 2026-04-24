'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import FadeUp from '@/components/FadeUp';

const SERVICES = [
  {
    href: '/detailing',
    title: 'Detailing Packages',
    desc: 'From a solid refresh to a full platinum transformation — your car leaves looking showroom-perfect.',
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7z" />
      </svg>
    ),
  },
  {
    href: '/detailing',
    title: 'Window Tinting',
    desc: 'Professional tinting for privacy, UV protection, and a sleek cinematic look that protects your interior.',
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" />
      </svg>
    ),
  },
  {
    href: '/mobile-mechanic',
    title: 'Mobile Mechanic',
    desc: 'We come to you. Oil changes, brakes, tires, diagnostics — full service at your home or office.',
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3-3a6 6 0 01-7.5 7.5l-4 4a2.1 2.1 0 01-3-3l4-4a6 6 0 017.5-7.5l-3 3z" />
      </svg>
    ),
  },
  {
    href: '/contact',
    title: 'Consultations',
    desc: 'Expert automotive advice. We help you navigate your options and make the best decision for your vehicle.',
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      </svg>
    ),
  },
  {
    href: '/inventory',
    title: 'Inventory / Shop',
    desc: 'Browse our curated selection of quality vehicles. Handpicked rides — new arrivals added regularly.',
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3M9 21h10a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    href: '/mobile-mechanic/fluid-services',
    title: 'Fluid Services',
    desc: 'Transmission, coolant, brake fluid, power steering — complete fluid maintenance at your location.',
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z" /><path d="M12 6v6l4 2" />
      </svg>
    ),
  },
] as const;

const CONTACT_ITEMS = [
  {
    label: 'Phone', value: '(905)-995-9108',
    icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3.1-8.7A2 2 0 014.1 2h3a2 2 0 012 1.7c.1.9.4 1.8.7 2.7a2 2 0 01-.5 2.1L8.1 9.6a16 16 0 006 6l1.1-1.1a2 2 0 012.1-.5c.9.3 1.8.6 2.7.7A2 2 0 0122 16.9z" /></svg>,
  },
  {
    label: 'Hours', value: 'Mon – Sun  10AM – 7PM',
    icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>,
  },
  {
    label: 'Instagram', value: '@autodriva',
    icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" /></svg>,
  },
  {
    label: 'Snapchat', value: '@AutoDriva.inc',
    icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M12 2C8 2 5 5 5 9v2l-2 3h3c.5 2 2 3 4 3.5-.5.5-1.5.5-2 .5 1 1 4 1.5 4 1.5s3-.5 4-1.5c-.5 0-1.5 0-2-.5C16 17 17.5 16 18 14h3l-2-3V9c0-4-3-7-7-7z" /></svg>,
  },
];

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const h = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  return (
    <div>
      {/* ── HERO ── */}
      <section className="relative h-screen min-h-[680px] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&q=80)',
            backgroundPosition: 'center 60%',
            transform: `scale(1.08) translateY(${scrollY * 0.18}px)`,
            willChange: 'transform',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-base/[0.94] via-base/[0.72] to-base/25" />
        <div className="absolute bottom-0 left-0 w-[35%] h-[3px] bg-gradient-to-r from-accent to-transparent" />
        <div className="absolute top-[30%] right-[8%] w-px h-[120px] bg-gradient-to-b from-transparent via-accent/40 to-transparent" />

        <div className="relative px-20 max-w-[860px] max-[600px]:px-6">
          <div className="inline-flex items-center gap-2.5 mb-7 px-4 py-[7px] bg-accent/[0.12] border border-accent/25 rounded-[4px]">
            <div className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_8px_#1e6ef4] animate-spin-slow" />
            <span className="text-accent text-[11px] font-semibold tracking-[2.5px] uppercase">
              Premium Automotive Services
            </span>
          </div>

          <h1
            className="font-barlow font-black uppercase tracking-[2px] leading-[0.88] mb-7"
            style={{ fontSize: 'clamp(58px,9.5vw,118px)' }}
          >
            Welcome to<br />
            <span className="text-accent">AUTODRIVA</span>
          </h1>

          <p className="text-lg text-white/70 mb-11 font-light tracking-wide">
            More Than A Ride —{' '}
            <strong className="text-white font-semibold">It&apos;s DRIVA</strong>
          </p>

          <div className="flex gap-3.5 flex-wrap">
            <Link
              href="/inventory"
              className="bg-accent text-white font-barlow text-[19px] font-black tracking-[2px] uppercase px-11 py-[17px] rounded hover:shadow-[0_0_40px_rgba(30,110,244,0.55)] hover:-translate-y-0.5 transition-all duration-200"
            >
              SHOP NOW
            </Link>
            <Link
              href="/contact"
              className="bg-transparent border border-white/25 text-white font-barlow text-[19px] font-black tracking-[2px] uppercase px-11 py-[17px] rounded hover:border-accent/60 hover:bg-accent/10 transition-all duration-200"
            >
              BOOK A SERVICE
            </Link>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-9 right-12 flex flex-col items-center gap-2.5 opacity-40">
          <span className="font-barlow text-[11px] tracking-[3px] uppercase [writing-mode:vertical-rl]">Scroll</span>
          <div className="w-px h-12 bg-white animate-scroll-pulse" />
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="py-[110px] px-20 bg-base max-[600px]:px-6 max-[600px]:py-16">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <span className="block text-accent text-[11px] font-semibold tracking-[3px] uppercase mb-3.5">
              What We Offer
            </span>
            <h2
              className="font-barlow font-black uppercase tracking-[2px]"
              style={{ fontSize: 'clamp(38px,5vw,64px)' }}
            >
              Our Services
            </h2>
            <div className="w-12 h-[3px] bg-accent mx-auto mt-5" />
          </div>

          <div className="grid grid-cols-3 gap-5 max-[900px]:grid-cols-2 max-[600px]:grid-cols-1">
            {SERVICES.map((svc, i) => (
              <FadeUp key={svc.title} delay={i * 70}>
                <Link
                  href={svc.href}
                  className="group block bg-card border border-white/[0.06] rounded-[10px] p-9 cursor-pointer hover:border-accent/40 hover:-translate-y-2 hover:shadow-[0_28px_60px_rgba(0,0,0,0.45),0_0_0_1px_rgba(30,110,244,0.15)] transition-all duration-300"
                >
                  <div className="w-[52px] h-[52px] rounded-[10px] mb-7 bg-white/[0.04] border border-white/[0.06] group-hover:bg-accent/[0.18] group-hover:border-accent/30 flex items-center justify-center text-accent transition-all duration-300">
                    {svc.icon}
                  </div>
                  <h3 className="font-barlow text-[22px] font-bold uppercase tracking-wide mb-3 text-[#ddd] group-hover:text-white transition-colors duration-200">
                    {svc.title}
                  </h3>
                  <p className="text-[#666] text-sm leading-[1.75] mb-7">{svc.desc}</p>
                  <div className="flex items-center gap-2 text-accent text-[13px] font-semibold tracking-wide uppercase">
                    Learn More
                    <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                      <path d="M9 1l4 4-4 4M1 5h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                </Link>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT STRIP ── */}
      <FadeUp>
        <section className="bg-[#0d0d0d] border-y border-white/[0.05]">
          <div className="flex justify-around items-center flex-wrap gap-8 py-11 px-20 max-w-[1200px] mx-auto max-[600px]:px-6 max-[600px]:flex-col max-[600px]:items-start">
            {CONTACT_ITEMS.map(item => (
              <div key={item.label} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-[10px] bg-accent/10 border border-accent/20 flex items-center justify-center text-accent flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <div className="text-[#444] text-[11px] font-semibold tracking-[1.5px] uppercase mb-1">{item.label}</div>
                  <div className="text-[#ddd] text-[15px] font-medium">{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </FadeUp>

      {/* ── CTA BANNER ── */}
      <section className="relative py-[100px] px-20 overflow-hidden max-[600px]:px-6 max-[600px]:py-16"
        style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #0d1a30 50%, #0a0a0a 100%)' }}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_50%_50%,rgba(30,110,244,0.07)_0%,transparent_70%)]" />
        <div className="relative text-center max-w-[700px] mx-auto">
          <h2
            className="font-barlow font-black uppercase tracking-[2px] mb-5"
            style={{ fontSize: 'clamp(36px,5vw,60px)' }}
          >
            Ready To Experience<br />
            <span className="text-accent">DRIVA?</span>
          </h2>
          <p className="text-[#666] text-base leading-[1.7] mb-10">
            Book a service, browse inventory, or get a consultation — we&apos;re here Mon–Sun to take care of your ride.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-accent text-white font-barlow text-[19px] font-black tracking-[2px] uppercase px-[52px] py-[18px] rounded hover:shadow-[0_0_40px_rgba(30,110,244,0.5)] hover:-translate-y-0.5 transition-all duration-200"
          >
            CONTACT US TODAY
          </Link>
        </div>
      </section>
    </div>
  );
}
