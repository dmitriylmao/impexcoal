'use client';

import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { i18n, type Locale } from '@/i18n/config';

type Props = {
  className?: string;
};

export default function LangSwitcher({ className }: Props) {
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
    <div className={className ?? 'lang-switcher'}>
      {i18n.locales.map((locale) => (
        <Link
          key={locale}
          href={getLink(locale)}
          className={locale === currentLocale ? 'lang-link lang-link-active' : 'lang-link'}
        >
          {locale.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}