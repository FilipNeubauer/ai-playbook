import { RootLayout } from '@/layouts/RootLayout';

export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RootLayout>{children}</RootLayout>;
}
