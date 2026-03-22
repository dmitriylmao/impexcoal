import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isValidLocale, type Locale } from '@/i18n/config';
import { DEFAULT_OG_IMAGE, getDefaultOgDescription, getHomeTitle, SITE_URL } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;

  if (!isValidLocale(lang)) {
    return {};
  }

  const locale = lang as Locale;
  const title = getHomeTitle(locale);
  const description = getDefaultOgDescription(locale);
  const ogImageUrl = new URL(DEFAULT_OG_IMAGE, SITE_URL);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: ogImageUrl }],
      locale,
    },
    twitter: {
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

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
