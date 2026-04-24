import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import BlueBtn from '@/components/BlueBtn';
import { SUB_SERVICES } from '@/lib/data';

interface Props {
  params: Promise<{ service: string }>;
}

export async function generateStaticParams() {
  return Object.keys(SUB_SERVICES).map(service => ({ service }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { service } = await params;
  const svc = SUB_SERVICES[service];
  if (!svc) return {};
  return { title: `${svc.title} — AutoDriva` };
}

export default async function SubServicePage({ params }: Props) {
  const { service } = await params;
  const svc = SUB_SERVICES[service];
  if (!svc) notFound();

  return (
    <div>
      <PageHero
        title={svc.title}
        sub="Mobile Mechanic Service — We Come To You"
        img={svc.img}
        backLabel="All Mobile Services"
        backHref="/mobile-mechanic"
      />

      {/* Description + What's Included */}
      <section className="py-20 px-20 bg-base max-[600px]:px-6">
        <div className="max-w-[960px] mx-auto">
          <div className="grid grid-cols-[1.1fr_0.9fr] gap-16 items-start max-[900px]:grid-cols-1">
            <div>
              <span className="block text-accent text-[11px] font-semibold tracking-[3px] uppercase mb-3.5">
                About This Service
              </span>
              <h2
                className="font-barlow font-black uppercase tracking-wide mb-6"
                style={{ fontSize: 'clamp(30px,4vw,50px)' }}
              >
                {svc.title}
              </h2>
              <p className="text-[#888] text-[15px] leading-[1.85] mb-9">{svc.desc}</p>
              <Link href="/contact">
                <BlueBtn>Book This Service</BlueBtn>
              </Link>
            </div>

            {/* What's Included */}
            <div className="bg-surface border border-white/[0.07] rounded-xl px-8 py-9">
              <h3 className="font-barlow text-[22px] font-black uppercase tracking-wide mb-7 text-accent">
                What&apos;s Included
              </h3>
              {svc.included.map((item, i) => (
                <div
                  key={i}
                  className={`flex gap-4 items-start mb-5 pb-5 ${
                    i < svc.included.length - 1 ? 'border-b border-white/[0.05]' : ''
                  }`}
                >
                  <div className="w-7 h-7 rounded-md bg-accent/[0.15] border border-accent/25 flex items-center justify-center flex-shrink-0">
                    <svg viewBox="0 0 14 10" width="12" height="9" fill="none">
                      <path d="M1 5l3 4L13 1" stroke="#1e6ef4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <p className="text-[#aaa] text-sm leading-[1.6] mt-1">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why AutoDriva */}
      <section className="bg-deep border-t border-white/[0.05] py-[60px] px-20 max-[600px]:px-6">
        <div className="max-w-[960px] mx-auto flex gap-10 flex-wrap justify-center">
          {[
            { label: 'No Shop Visit',    desc: 'We come to your home or office' },
            { label: 'Same-Day Service', desc: 'Book and get serviced fast' },
            { label: 'Honest Pricing',   desc: 'No hidden fees, no upselling' },
            { label: 'Mon – Sun',        desc: '10:00 AM – 7:00 PM' },
          ].map(f => (
            <div key={f.label} className="text-center flex-[1_1_180px]">
              <div className="w-1.5 h-1.5 rounded-full bg-accent mx-auto mb-3.5 shadow-[0_0_12px_#1e6ef4]" />
              <h4 className="font-barlow text-lg font-black uppercase tracking-wide mb-1.5">{f.label}</h4>
              <p className="text-[#555] text-[13px]">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-20 bg-base text-center max-[600px]:px-6">
        <h2
          className="font-barlow font-black uppercase tracking-[2px] mb-4"
          style={{ fontSize: 'clamp(32px,4.5vw,56px)' }}
        >
          Ready to Book?
        </h2>
        <p className="text-[#666] text-[15px] mb-9">
          Contact us to schedule your {svc.title.toLowerCase()} — we&apos;ll come to you.
        </p>
        <Link href="/contact">
          <BlueBtn>Book This Service →</BlueBtn>
        </Link>
      </section>
    </div>
  );
}
