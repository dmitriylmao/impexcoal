'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import CookieConsentBanner from '@/components/CookieConsentBanner';
import { i18n, isValidLocale, type Locale } from '@/i18n/config';
import { scrollToSection } from '@/lib/scroll-to-section';

export default function SiteFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');
  const localeFromPath = pathname.split('/').filter(Boolean)[0];
  const locale: Locale = isValidLocale(localeFromPath) ? localeFromPath : i18n.defaultLocale;

  useEffect(() => {
    if (isAdminRoute) {
      return;
    }

    const hash = window.location.hash.replace(/^#/, '');

    if (hash) {
      requestAnimationFrame(() => scrollToSection(hash, 'auto'));
      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [isAdminRoute, pathname]);

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <div className="site-shell">
      <SiteHeader />
      <main className="site-main">{children}</main>
      <SiteFooter />
      <CookieConsentBanner locale={locale} />
    </div>
  );
}
