'use client';

import Image from 'next/image';
import { useParams } from 'next/navigation';
import LangSwitcher from '@/components/LangSwitcher';
import { getUiDictionary } from '@/dictionaries/ui-dictionary';
import styles from './SiteFooter.module.css';

export default function SiteFooter() {
  const params = useParams<{ lang?: string }>();
  const dict = getUiDictionary(params?.lang);

  const links = [
    dict.ui.footer.links.home,
    dict.ui.footer.links.company,
    dict.ui.footer.links.contacts,
    dict.ui.footer.links.news,
    dict.ui.footer.links.privacy,
  ];

  return (
    <footer className={styles.root}>
      <div className={styles.inner}>
        <button type="button" className={styles.logoButton} aria-label="IMPEKS logo">
          <Image src="/logo.png" alt="ТД ИМПЭКС" width={196} height={44} className={styles.logo} />
        </button>

        <div className={styles.links}>
          {links.map((item) => (
            <button key={item} type="button" className={styles.linkButton}>
              {item}
            </button>
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