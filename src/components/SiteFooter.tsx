'use client';

import Link from 'next/link';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { getUiDictionary } from '@/dictionaries/ui-dictionary';
import { i18n, isValidLocale, type Locale } from '@/i18n/config';
import { scrollToSection } from '@/lib/scroll-to-section';
import styles from './SiteFooter.module.css';

export default function SiteFooter() {
  const CONTACT_PHONE = '+79889451728';
  const CONTACT_PHONE_PLAIN = '79889451728';
  const params = useParams<{ lang?: string }>();
  const pathname = usePathname();
  const localeFromParams = params?.lang;
  const localeFromPath = pathname.split('/').filter(Boolean)[0];
  const locale: Locale = localeFromParams && isValidLocale(localeFromParams)
    ? localeFromParams
    : localeFromPath && isValidLocale(localeFromPath)
      ? localeFromPath
      : i18n.defaultLocale;
  const router = useRouter();
  const dict = getUiDictionary(locale);
  const homePath = `/${locale}`;

  const links = [
    { label: dict.ui.footer.links.home, href: `/${locale}#top` },
    { label: dict.ui.footer.links.contacts, href: `/${locale}/contacts` },
    { label: dict.ui.footer.links.news, href: `/${locale}/news` },
    { label: dict.ui.footer.links.privacy, href: `/${locale}/privacy` },
  ];
  const socialLinks = [
    { label: 'Telegram', href: `https://t.me/+${CONTACT_PHONE_PLAIN}`, iconClass: styles.telegramIcon, external: true },
    { label: 'WhatsApp', href: `https://wa.me/${CONTACT_PHONE_PLAIN}`, iconClass: styles.whatsappIcon, external: true },
    { label: 'MAX', href: `tel:${CONTACT_PHONE}`, iconClass: styles.maxIcon, external: false },
    { label: 'Phone', href: `tel:${CONTACT_PHONE}`, iconClass: styles.phoneIcon, external: false },
    { label: 'Email', href: 'mailto:sales@tdimpeks.ru', iconClass: styles.mailHeroIcon, external: false },
  ];

  const handleLogoNavigation = () => {
    if (pathname !== homePath) {
      router.push(`${homePath}#top`);
      return;
    }

    scrollToSection('top');
  };

  return (
    <footer className={styles.root}>
      <div className={styles.inner}>
        <button type="button" className={styles.logoButton} aria-label="IMPEKS logo" onClick={handleLogoNavigation}>
          <span className={styles.logo} aria-hidden />
          <span className={styles.brandText}>{dict.ui.header.brand}</span>
        </button>

        <div className={styles.links}>
          {links.map((item) => (
            <Link key={item.label} href={item.href} className={styles.linkButton}>
              {item.label}
            </Link>
          ))}
        </div>

        <div className={styles.socials}>
          {socialLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={styles.socialButton}
              aria-label={item.label}
              {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              <span className={`${styles.socialIcon} ${item.iconClass}`} aria-hidden />
            </a>
          ))}
        </div>

        <div className={styles.bottomLine}>
          <div className={styles.bottomLeft}>
            <span>{dict.ui.footer.copyright}</span>
            <Link href="/admin" className={styles.adminLink} aria-label="Admin panel">
              <span className={styles.keyIcon} aria-hidden />
            </Link>
          </div>
          <span>{dict.ui.footer.email}</span>
        </div>
      </div>
    </footer>
  );
}
