import Link from 'next/link';
import PageHero from '@/components/PageHero';

const MECH_SERVICES = [
  {
    slug: 'oil-change',
    title: 'Oil Service',
    desc: 'Conventional, synthetic or high-mileage oil changes at your location.',
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <path d="M20 14a8 8 0 11-16 0c0-3 1-5.5 4-8l4-4 4 4c3 2.5 4 5 4 8z" />
      </svg>
    ),
  },
  {
    slug: 'tire-care',
    title: 'Tire Care',
    desc: 'Rotation, balancing, pressure checks, and flat tire assistance.',
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="4" />
        <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
      </svg>
    ),
  },
  {
    slug: 'brakes-service',
    title: 'Brakes Service',
    desc: 'Brake pad replacement, rotor inspection, and fluid flush.',
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
      </svg>
    ),
  },
  {
    slug: 'diagnostic-service',
    title: 'Diagnostic',
    desc: 'OBD-II scan, fault code analysis, and full vehicle system report.',
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <path d="M9 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-4M16 3l5 5-9 9H7v-5l9-9z" />
      </svg>
    ),
  },
  {
    slug: 'fluid-services',
    title: 'Fluid Services',
    desc: 'Transmission, coolant, power steering, and brake fluid maintenance.',
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <path d="M12 2l6 10H6L12 2zM6 12h12v8a2 2 0 01-2 2H8a2 2 0 01-2-2v-8z" />
      </svg>
    ),
  },
  {
    slug: 'filter-services',
    title: 'Filter Services',
    desc: 'Engine air, cabin air, oil, and fuel filter inspection and replacement.',
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
      </svg>
    ),
  },
];

export default function MobileMechanicPage() {
  return (
    <div>
      <PageHero
        title="We Come To You"
        sub="Mobile mechanic services at your home, office, or wherever you are."
        img="https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?w=1600&q=80"
      />

      <section className="py-[90px] px-20 bg-base max-[600px]:px-6">
        <div className="max-w-[1140px] mx-auto">
          <div className="text-center mb-14">
            <span className="block text-accent text-[11px] font-semibold tracking-[3px] uppercase mb-3">
              No Shop Needed
            </span>
            <h2
              className="font-barlow font-black uppercase tracking-[2px]"
              style={{ fontSize: 'clamp(34px,5vw,58px)' }}
            >
              Mobile Services
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-5 max-[900px]:grid-cols-2 max-[600px]:grid-cols-1">
            {MECH_SERVICES.map(svc => (
              <Link
                key={svc.slug}
                href={`/mobile-mechanic/${svc.slug}`}
                className="group block bg-card border border-white/[0.06] rounded-[10px] px-7 py-8 hover:border-accent/40 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)] transition-all duration-300 cursor-pointer"
              >
                <div className="text-accent mb-5">{svc.icon}</div>
                <h3 className="font-barlow text-[22px] font-black uppercase tracking-wide mb-2.5">{svc.title}</h3>
                <p className="text-[#666] text-sm leading-[1.7] mb-5">{svc.desc}</p>
                <span className="flex items-center gap-1.5 text-accent text-[13px] font-semibold tracking-wide uppercase">
                  Learn More
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                    <path d="M8 1l3 3-3 3M1 4h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
