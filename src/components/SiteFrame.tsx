'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { scrollToSection } from '@/lib/scroll-to-section';

export default function SiteFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');

  useEffect(() => {
    if (isAdminRoute) {
      return;
    }

    const hash = window.location.hash.replace(/^#/, '');

    if (hash) {
      requestAnimationFrame(() => scrollToSection(hash, 'auto'));
      return;
    }

    // DEV TEMP: disables forced scroll-to-top on each page mount/refresh while layouting.
    // Re-enable this line after finishing UI work to restore default behavior.
    // window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [isAdminRoute, pathname]);

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <div className="site-shell">
      <SiteHeader />
      <main className="site-main">{children}</main>
      <SiteFooter />
    </div>
  );
}
