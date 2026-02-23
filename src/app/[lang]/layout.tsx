import { notFound } from 'next/navigation';
import { isValidLocale } from '@/i18n/config';

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;

  if (!isValidLocale(lang)) {
    notFound();
  }

  return <>{children}</>;
}
