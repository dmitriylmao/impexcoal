'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Locale } from '@/i18n/config';
import styles from './NewsListClient.module.css';

type NewsCard = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  publishedAt: string;
  imageUrl: string | null;
};

type Props = {
  locale: Locale;
  badge: string;
  title: string;
  subtitle: string;
  loadMoreLabel: string;
  cards: NewsCard[];
};

const INITIAL_COUNT = 4;
const STEP_COUNT = 8;

export default function NewsListClient({ locale, badge, title, subtitle, loadMoreLabel, cards }: Props) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  const visibleCards = useMemo(() => cards.slice(0, visibleCount), [cards, visibleCount]);

  return (
    <section className={styles.wrapper}>
      <div className={styles.hero}>
          <span className={styles.badge}>
              <Image src="/icons/newspaper.svg" alt="" width={14} height={14} className={styles.badgeIcon} aria-hidden />
              {badge}
          </span>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>

      <div className={styles.grid}>
        {visibleCards.map((card) => (
          <Link key={card.id} href={`/${locale}/news/${card.slug}`} className={styles.card}>
            <h2 className={styles.cardTitle}>{card.title}</h2>
            <p className={styles.cardSubtitle}>{card.subtitle}</p>
            <p className={styles.cardSubtitle}>{card.publishedAt}</p>
            {card.imageUrl ? <img src={card.imageUrl} alt={card.title} className={styles.cardImage} loading="lazy" /> : null}
          </Link>
        ))}
      </div>

      {visibleCount < cards.length ? (
        <div className={styles.actions}>
          <button type="button" className={styles.loadMoreButton} onClick={() => setVisibleCount((value) => value + STEP_COUNT)}>
            <div className={styles.buttonGlow}></div>

            <div className={styles.borderWrapper}>
              <div className={`${styles.stroke} ${styles.strokeDefault}`}></div>
              <div className={`${styles.stroke} ${styles.strokeHover}`}></div>
            </div>

            <div className={styles.innerFill}></div>
            <span className={styles.loadMoreButtonLabel}>{loadMoreLabel}</span>
          </button>
        </div>
      ) : null}
    </section>
  );
}
