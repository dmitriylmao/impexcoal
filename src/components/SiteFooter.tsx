'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import LangSwitcher from '@/components/LangSwitcher';
import { getUiDictionary } from '@/dictionaries/ui-dictionary';
import styles from './SiteFooter.module.css';

export default function SiteFooter() {
  const params = useParams<{ lang?: string }>();
  const dict = getUiDictionary(params?.lang);
  const locale = params?.lang ?? 'ru';

  const links = [
    { label: dict.ui.footer.links.home, href: `/${locale}#top` },
    { label: dict.ui.footer.links.contacts, href: `/${locale}/contacts` },
    { label: dict.ui.footer.links.news, href: `/${locale}/news` },
  ];

  return (
    <footer className={styles.root}>
      <div className={styles.inner}>
        <button type="button" className={styles.logoButton} aria-label="IMPEKS logo">
          <Image src="/logo.png" alt="ТД ИМПЭКС" width={196} height={44} className={styles.logo} />
        </button>

        <div className={styles.links}>
          {links.map((item) => (
            <Link key={item.label} href={item.href} className={styles.linkButton}>
              {item.label}
            </Link>
          ))}
        </div>

        <div className={styles.socials}>
          {Array.from({ length: 4 }).map((_, index) => (
            <button key={index} type="button" className={styles.socialButton}>
              <Image src="/telegram.svg" alt="Telegram" width={18} height={18} className={styles.telegramIcon} />
            </button>
          ))}
        </div>

        <div className={styles.bottomLine}>
          <span>{dict.ui.footer.copyright}</span>
          <LangSwitcher className={styles.switcher} />
          <span>{dict.ui.footer.email}</span>
        </div>
      </div>
    </footer>
  );
}
