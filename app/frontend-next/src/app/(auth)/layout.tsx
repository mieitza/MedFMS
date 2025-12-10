import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Autentificare',
  description: 'Autentificați-vă pentru a accesa MedFMS',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
