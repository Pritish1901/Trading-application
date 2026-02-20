import { DashboardLayout } from '@/components/layout/DashboardLayout';

export const metadata = {
  title: 'Dashboard - Crypto Trading',
};

export default function DashboardLayoutRoot({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
