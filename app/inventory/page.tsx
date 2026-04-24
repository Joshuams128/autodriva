import PageHero from '@/components/PageHero';
import { ContactFormMini } from '@/components/ContactForm';
import { CAR_CARDS } from '@/lib/data';

function CarCard({ car }: { car: typeof CAR_CARDS[number] }) {
  return (
    <div className="group bg-card border border-white/[0.06] rounded-[10px] overflow-hidden hover:border-accent/35 hover:-translate-y-1.5 hover:shadow-[0_24px_60px_rgba(0,0,0,0.5)] transition-all duration-300 cursor-pointer">
      {/* Placeholder image */}
      <div
        className="h-[200px] relative overflow-hidden flex items-center justify-center"
        style={{ background: `linear-gradient(135deg, #111 0%, ${car.color}22 100%)` }}
      >
        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.015)_0px,rgba(255,255,255,0.015)_1px,transparent_1px,transparent_12px)]" />
        <svg viewBox="0 0 80 36" width="140" height="63" fill="none" className="opacity-[0.18]">
          <path d="M8 26h64M12 26l6-10h24l10 10" stroke="white" strokeWidth="2" strokeLinecap="round" />
          <path d="M18 16l4-8h16l4 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="20" cy="26" r="5" stroke="white" strokeWidth="2" />
          <circle cx="60" cy="26" r="5" stroke="white" strokeWidth="2" />
        </svg>
        <div className="absolute top-3 right-3 bg-accent/90 rounded px-2.5 py-1 text-[11px] font-bold tracking-wide text-white">
          {car.year}
        </div>
      </div>

      <div className="px-[22px] pt-5 pb-6">
        <p className="text-[#555] text-[12px] font-semibold tracking-[1.5px] uppercase mb-1.5">{car.make}</p>
        <h3 className="font-barlow text-[22px] font-black tracking-wide mb-4 text-[#eee]">{car.model}</h3>
        <div className="flex justify-between items-center">
          <span className="font-barlow text-[20px] font-bold text-accent">Coming Soon</span>
          <button className="border border-white/15 text-[#ccc] text-[12px] font-medium px-4 py-2 rounded hover:border-accent hover:text-accent transition-all duration-200">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default function InventoryPage() {
  return (
    <div>
      <PageHero
        title="Browse Our Inventory"
        sub="Handpicked quality vehicles — new arrivals added regularly."
        img="https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1600&q=80"
      />

      <section className="py-20 px-20 bg-base max-[600px]:px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-3 gap-5 mb-10 max-[900px]:grid-cols-2 max-[600px]:grid-cols-1">
            {CAR_CARDS.map(c => <CarCard key={c.model} car={c} />)}
          </div>

          <div className="bg-accent/[0.08] border border-accent/20 rounded-[10px] px-9 py-7 text-center mb-16">
            <p className="font-barlow text-[22px] font-bold tracking-wide uppercase text-accent">
              More vehicles coming soon — check back regularly or request a specific vehicle below.
            </p>
          </div>

          <ContactFormMini heading="Request a Test Drive" />
        </div>
      </section>
    </div>
  );
}
