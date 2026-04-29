import DashboardSessionProvider from './SessionProvider';
import DashboardShell from './DashboardShell';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardSessionProvider>
      <DashboardShell>{children}</DashboardShell>
    </DashboardSessionProvider>
  );
}
