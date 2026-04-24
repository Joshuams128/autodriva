import PageHero from '@/components/PageHero';
import { ContactFormFull } from '@/components/ContactForm';

const INFO_ITEMS = [
  { label: 'Phone',     val: '(905)-995-9108',  sub: 'Call or text us anytime' },
  { label: 'Hours',     val: 'Mon – Sun',        sub: '10:00 AM – 7:00 PM' },
  { label: 'Instagram', val: '@autodriva',       sub: 'DM us for quick replies' },
  { label: 'Snapchat',  val: '@AutoDriva.inc',   sub: '' },
];

export default function ContactPage() {
  return (
    <div>
      <PageHero
        title="Get In Touch"
        sub="We're available Mon–Sun 10AM–7PM. Reach out anytime."
        img="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1600&q=80"
      />

      <section className="py-20 px-20 bg-base max-[600px]:px-6">
        <div className="grid grid-cols-[1fr_1.4fr] gap-12 max-w-[1100px] mx-auto max-[900px]:grid-cols-1">

          {/* Left info */}
          <div>
            <h2 className="font-barlow text-[42px] font-black uppercase tracking-[2px] mb-9">
              Contact Info
            </h2>
            {INFO_ITEMS.map(item => (
              <div key={item.label} className="flex gap-5 mb-8 items-start">
                <div className="w-12 h-12 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                </div>
                <div>
                  <p className="text-[#444] text-[11px] font-semibold tracking-[2px] uppercase mb-1.5">{item.label}</p>
                  <p className="text-white text-[17px] font-semibold mb-1">{item.val}</p>
                  {item.sub && <p className="text-[#555] text-[13px]">{item.sub}</p>}
                </div>
              </div>
            ))}
          </div>

          {/* Right form */}
          <ContactFormFull />
        </div>
      </section>
    </div>
  );
}
