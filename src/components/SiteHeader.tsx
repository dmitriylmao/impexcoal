'use client';

import Image from 'next/image';
import { useParams } from 'next/navigation';
import { getUiDictionary } from '@/dictionaries/ui-dictionary';
import styles from './SiteHeader.module.css';

export default function SiteHeader() {
  const params = useParams<{ lang?: string }>();
  const dict = getUiDictionary(params?.lang);

  const navItems = [
    dict.ui.header.nav.home,
    dict.ui.header.nav.about,
    dict.ui.header.nav.segments,
    dict.ui.header.nav.products,
    dict.ui.header.nav.news,
    dict.ui.header.nav.contacts,
  ];

  return (
    <header className={styles.root}>
      <div className={styles.inner}>
        <button type="button" className={styles.logoButton} aria-label="IMPEKS logo">
          <Image src="/logo.png" alt="ТД ИМПЭКС" width={196} height={44} className={styles.logo} priority />
        </button>

        <nav className={styles.nav} aria-label="Primary navigation">
          {navItems.map((item) => (
            <button key={item} type="button" className={styles.navButton}>
              {item}
            </button>
          ))}
        </nav>

        <button type="button" className={styles.contactButton}>
          <span>{dict.ui.header.contactButton}</span>
          <Image src="/telegram.svg" alt="Telegram" width={18} height={18} className={styles.telegramIcon} />
        </button>
      </div>
    </header>
  );
}