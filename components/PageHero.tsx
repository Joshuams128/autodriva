import Link from 'next/link';

interface PageHeroProps {
  title: string;
  sub?: string;
  img: string;
  backLabel?: string;
  backHref?: string;
}

export default function PageHero({ title, sub, img, backLabel, backHref }: PageHeroProps) {
  return (
    <section className="relative h-[52vh] min-h-[420px] flex items-end overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center brightness-[0.35]"
        style={{ backgroundImage: `url(${img})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/[0.92]" />
      <div className="absolute bottom-0 left-0 w-[28%] h-[3px] bg-gradient-to-r from-accent to-transparent" />

      <div className="relative px-20 pb-[60px] w-full max-[600px]:px-6">
        {backHref && (
          <Link
            href={backHref}
            className="inline-flex items-center gap-1.5 text-accent text-[13px] mb-4 hover:underline"
          >
            <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
              <path d="M5 1L1 5l4 4M1 5h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            {backLabel}
          </Link>
        )}
        <span className="block text-accent text-[11px] font-semibold tracking-[3px] uppercase mb-3">
          AutoDriva
        </span>
        <h1
          className="font-barlow font-black uppercase tracking-[2px] leading-[0.92]"
          style={{ fontSize: 'clamp(40px,7vw,84px)' }}
        >
          {title}
        </h1>
        {sub && <p className="text-white/60 text-base mt-4 font-light">{sub}</p>}
      </div>
    </section>
  );
}
