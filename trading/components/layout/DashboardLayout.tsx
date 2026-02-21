'use client';

import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { usePathname } from 'next/navigation';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="flex">
      <Sidebar active={pathname} />
      <div className="flex-1 ml-64">
        <Header />
        <main className="mt-16 p-6 bg-neutral-900 min-h-screen">{children}</main>
      </div>
    </div>
  );
}
