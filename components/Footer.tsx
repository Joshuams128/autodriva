import Link from 'next/link';
import Logo from './Logo';

const SERVICE_LINKS = [
  { label: 'Detailing',       href: '/detailing' },
  { label: 'Tinting',         href: '/detailing' },
  { label: 'Mobile Mechanic', href: '/mobile-mechanic' },
  { label: 'Consultations',   href: '/contact' },
  { label: 'Fluid Services',  href: '/mobile-mechanic/fluid-services' },
  { label: 'Filter Services', href: '/mobile-mechanic/filter-services' },
];

const PAGE_LINKS = [
  { label: 'Home',            href: '/' },
  { label: 'Inventory',       href: '/inventory' },
  { label: 'Detailing',       href: '/detailing' },
  { label: 'Mobile Mechanic', href: '/mobile-mechanic' },
  { label: 'Consultant',      href: '/contact' },
];

export default function Footer() {
  return (
    <footer className="bg-footer border-t border-white/[0.06] px-20 pt-16 pb-10 max-[600px]:px-6">
      <div className="grid grid-cols-[2fr_1fr_1fr_1fr] max-[900px]:grid-cols-[1fr_1fr] gap-12 mb-14">
        {/* Brand */}
        <div>
          <Link href="/" className="block mb-5" aria-label="AutoDriva home">
            <Logo width={130} />
          </Link>
          <p className="text-[#555] text-sm leading-[1.7] max-w-[270px] mb-6">
            Premium automotive services — detailing, mobile mechanic, inventory and more.
            More Than A Ride — It&apos;s DRIVA.
          </p>
          <div className="flex flex-col gap-2">
            <a
              href="https://instagram.com/autodriva"
              target="_blank"
              rel="noreferrer"
              className="text-[#555] text-[13px] no-underline hover:text-accent transition-colors duration-200"
            >
              Instagram — @autodriva
            </a>
            <span className="text-[#555] text-[13px]">Snapchat — @AutoDriva.inc</span>
          </div>
        </div>

        {/* Services */}
        <div>
          <h4 className="font-barlow text-sm font-bold tracking-[2.5px] uppercase text-accent mb-5">
            Services
          </h4>
          {SERVICE_LINKS.map(l => (
            <Link
              key={l.label}
              href={l.href}
              className="block text-[#555] text-sm py-[5px] hover:text-white transition-colors duration-200"
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Pages */}
        <div>
          <h4 className="font-barlow text-sm font-bold tracking-[2.5px] uppercase text-accent mb-5">
            Pages
          </h4>
          {PAGE_LINKS.map(l => (
            <Link
              key={l.label}
              href={l.href}
              className="block text-[#555] text-sm py-[5px] hover:text-white transition-colors duration-200"
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-barlow text-sm font-bold tracking-[2.5px] uppercase text-accent mb-5">
            Contact
          </h4>
          <p className="text-[#888] text-[15px] font-medium mb-1.5">(905)-995-9108</p>
          <p className="text-[#555] text-[13px] mb-1">Mon – Sun</p>
          <p className="text-[#555] text-[13px] mb-7">10:00 AM – 7:00 PM</p>
          <Link
            href="/contact"
            className="inline-block border border-accent/50 text-accent font-barlow text-sm font-bold tracking-[1.5px] uppercase px-5 py-[10px] rounded hover:bg-accent hover:text-white transition-all duration-200"
          >
            Get In Touch
          </Link>
        </div>
      </div>

      <div className="border-t border-white/[0.05] pt-7 flex justify-between items-center flex-wrap gap-3">
        <p className="text-[#333] text-[13px]">© Created by AutoDriva 2025. All rights reserved.</p>
        <p className="text-[#333] text-[13px]">autodriva.com</p>
      </div>
    </footer>
  );
}
