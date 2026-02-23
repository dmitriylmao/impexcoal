'use client';

import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { i18n, type Locale } from '@/i18n/config';

export default function LangSwitcher() {
  const pathname = usePathname();
  const params = useParams<{ lang?: string }>();
  const currentLocale = (params?.lang ?? i18n.defaultLocale) as Locale;

  const getLink = (locale: Locale) => {
    const segments = pathname.split('/').filter(Boolean);

    if (segments.length === 0) {
      return `/${locale}`;
    }

    if (i18n.locales.includes(segments[0] as Locale)) {
      segments[0] = locale;
    } else {
      segments.unshift(locale);
    }

    return `/${segments.join('/')}`;
  };

  return (
    <div className="flex gap-4 text-sm font-medium">
      {i18n.locales.map((locale) => (
        <Link
          key={locale}
          href={getLink(locale)}
          className={
            locale === currentLocale
              ? 'text-zinc-900 dark:text-white'
              : 'text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-white'
          }
        >
          {locale.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}
