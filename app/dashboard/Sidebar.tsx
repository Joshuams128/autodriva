'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

const NAV = [
  { href: '/dashboard', label: 'Overview' },
  { href: '/dashboard/bookings', label: 'Bookings' },
  { href: '/dashboard/calendar', label: 'Calendar' },
  { href: '/dashboard/invoices', label: 'Invoices' },
  { href: '/dashboard/settings', label: 'Settings' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 shrink-0 bg-[#0d0d0d] border-r border-white/[0.06] min-h-screen p-5 flex flex-col">
      <div className="text-white text-lg font-bold tracking-wider mb-8">AUTODRIVA</div>
      <nav className="flex flex-col gap-1 flex-1">
        {NAV.map((n) => {
          const active =
            n.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(n.href);
          return (
            <Link
              key={n.href}
              href={n.href}
              className={[
                'px-3 py-2 rounded-md text-sm transition-colors',
                active
                  ? 'bg-[#2563eb]/15 text-[#2563eb]'
                  : 'text-white/70 hover:text-white hover:bg-white/[0.04]',
              ].join(' ')}
            >
              {n.label}
            </Link>
          );
        })}
      </nav>
      <button
        onClick={() => signOut({ callbackUrl: '/dashboard/login' })}
        className="mt-4 px-3 py-2 rounded-md text-sm text-white/60 hover:text-white hover:bg-white/[0.04] text-left"
      >
        Sign out
      </button>
    </aside>
  );
}
