'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from './Logo';

const MECH_LINKS = [
  { label: 'Oil Service',        href: '/mobile-mechanic/oil-change' },
  { label: 'Tire Care',          href: '/mobile-mechanic/tire-care' },
  { label: 'Brakes Service',     href: '/mobile-mechanic/brakes-service' },
  { label: 'Diagnostic Service', href: '/mobile-mechanic/diagnostic-service' },
  { label: 'Fluid Services',     href: '/mobile-mechanic/fluid-services' },
  { label: 'Filter Services',    href: '/mobile-mechanic/filter-services' },
];

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`text-sm font-medium tracking-wide transition-colors duration-200 ${
        active ? 'text-accent' : 'text-white/[0.85] hover:text-white'
      }`}
    >
      {children}
    </Link>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled,     setScrolled]     = useState(false);
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  const isMechActive =
    pathname === '/mobile-mechanic' ||
    MECH_LINKS.some(l => pathname.startsWith(l.href));

  return (
    <>
      <nav
        className={[
          'fixed top-0 left-0 right-0 z-[1000] h-[80px]',
          'flex items-center justify-between px-16 max-[600px]:px-8 py-4',
          'transition-all duration-300',
          scrolled
            ? 'bg-black/[0.96] backdrop-blur-[14px] border-b border-white/[0.07]'
            : 'bg-transparent border-b border-transparent',
        ].join(' ')}
      >
        <Link href="/" aria-label="AutoDriva home">
          <Logo width={136} />
        </Link>

        <div className="flex items-center gap-8">
          {/* Desktop-only links */}
          <div className="flex items-center gap-8 max-[900px]:hidden">
            <NavLink href="/inventory"   active={pathname === '/inventory'}>Inventory</NavLink>
            <NavLink href="/detailing"   active={pathname === '/detailing'}>Detailing</NavLink>

            {/* Mobile Mechanic dropdown */}
            <div
              className="relative group"
              onMouseEnter={() => setDropdownOpen(true)}
            >
              <Link
                href="/mobile-mechanic"
                className={`flex items-center gap-1.5 text-sm font-medium tracking-wide transition-colors duration-200 ${
                  isMechActive ? 'text-accent' : 'text-white/[0.85] hover:text-white'
                }`}
              >
                Mobile Mechanic
                <svg
                  width="10" height="6" viewBox="0 0 10 6" fill="currentColor"
                  className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                >
                  <path d="M0 0l5 6 5-6H0z" />
                </svg>
              </Link>

              {dropdownOpen && (
                <div className="absolute top-[calc(100%+8px)] left-0 bg-[#111] border border-white/[0.08] rounded-lg overflow-hidden min-w-[210px] shadow-[0_24px_64px_rgba(0,0,0,0.6)]" onMouseEnter={() => setDropdownOpen(true)} onMouseLeave={() => setDropdownOpen(false)}>
                    {MECH_LINKS.map((l, i) => (
                      <Link
                        key={l.href}
                        href={l.href}
                        className={[
                          'block px-5 py-3 text-[13px] transition-colors duration-150',
                          'hover:bg-accent/[0.12] hover:text-white',
                          i < MECH_LINKS.length - 1 ? 'border-b border-white/[0.04]' : '',
                          pathname === l.href ? 'text-accent' : 'text-[#bbb]',
                        ].join(' ')}
                      >
                        {l.label}
                      </Link>
                    ))}
                </div>
              )}
            </div>

            <NavLink href="/contact" active={pathname === '/contact'}>Consultant</NavLink>

            <Link
              href="/inventory"
              className="bg-accent text-white font-barlow text-base font-bold tracking-[1.5px] uppercase px-6 py-[10px] rounded transition-all duration-200 hover:shadow-[0_0_28px_rgba(30,110,244,0.55)] hover:-translate-y-px"
            >
              Shop Now
            </Link>
          </div>

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMobileOpen(o => !o)}
            className="hidden max-[900px]:flex flex-col gap-[5px] p-1 bg-transparent border-0 cursor-pointer"
            aria-label="Toggle menu"
          >
            <span className="block w-[22px] h-0.5 bg-white" />
            <span className="block w-[22px] h-0.5 bg-white" />
            <span className="block w-3.5 h-0.5 bg-white" />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed top-[72px] left-0 right-0 z-[999] bg-black/[0.98] backdrop-blur-2xl border-b border-white/[0.08] px-8 pt-6 pb-8">
          {([
            { label: 'Home',            href: '/',                  indent: false },
            { label: 'Inventory',       href: '/inventory',         indent: false },
            { label: 'Detailing',       href: '/detailing',         indent: false },
            { label: 'Mobile Mechanic', href: '/mobile-mechanic',   indent: false },
            ...MECH_LINKS.map(l => ({ ...l, indent: true })),
            { label: 'Consultant',      href: '/contact',           indent: false },
          ] as Array<{ label: string; href: string; indent: boolean }>).map(l => (
            <Link
              key={l.href + (l.indent ? '_sub' : '')}
              href={l.href}
              className={[
                'block w-full font-barlow font-bold tracking-[1px] uppercase',
                'border-b border-white/[0.04] transition-colors duration-150',
                l.indent ? 'text-[17px] py-1.5 pl-5' : 'text-[22px] py-2.5',
                pathname === l.href ? 'text-accent' : 'text-[#ccc]',
              ].join(' ')}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
