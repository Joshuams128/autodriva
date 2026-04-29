'use client';

import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === '/dashboard/login';

  if (isLogin) {
    return <div className="min-h-screen bg-black text-white">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      <Sidebar />
      <div className="flex-1 p-8 overflow-x-auto">{children}</div>
    </div>
  );
}
