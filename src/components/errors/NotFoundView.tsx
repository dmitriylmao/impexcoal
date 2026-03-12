'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { getUiDictionary } from '@/dictionaries/ui-dictionary';
import { i18n, isValidLocale, type Locale } from '@/i18n/config';
import styles from './NotFoundView.module.css';

export default function NotFoundView() {
  const params = useParams<{ lang?: string }>();
  const pathname = usePathname();
  const localeFromParams = params?.lang;
  const localeFromPath = pathname.split('/').filter(Boolean)[0];
  const locale: Locale = localeFromParams && isValidLocale(localeFromParams)
    ? localeFromParams
    : localeFromPath && isValidLocale(localeFromPath)
      ? localeFromPath
      : i18n.defaultLocale;
  const t = getUiDictionary(locale).ui.notFound;

  return (
    <section className={styles.root} aria-labelledby="not-found-title">
      <div className={styles.rays} aria-hidden="true" />
      <div className={styles.particles} aria-hidden="true" />

      <div className={styles.inner}>
        <p className={styles.code} aria-label="404">
          <span className={styles.codeDigit}>4</span>
          <span className={styles.codeDigit}>0</span>
          <span className={styles.codeDigit}>4</span>
        </p>

        <p className={styles.label}>{t.codeLabel}</p>
        <h1 id="not-found-title" className={styles.title}>
          {t.title}
        </h1>

        <Link href={`/${locale}`} className={styles.homeButton}>
          <div className={styles.glow} />
          <div className={styles.borderWrapper}>
            <div className={`${styles.stroke} ${styles.strokeDefault}`} />
            <div className={`${styles.stroke} ${styles.strokeHover}`} />
          </div>
          <div className={styles.innerFill} />
          <span className={styles.homeLabel}>{t.homeButton}</span>
          <Image src="/icons/arrow-arc-left.svg" alt="" aria-hidden width={16} height={16} className={styles.homeIcon} />
        </Link>
      </div>
    </section>
  );
}
