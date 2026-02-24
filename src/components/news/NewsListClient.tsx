'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import styles from './NewsListClient.module.css';

type NewsCard = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
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
const STEP_COUNT = 6;

export default function NewsListClient({ locale, badge, title, subtitle, loadMoreLabel, cards }: Props) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  const visibleCards = useMemo(() => cards.slice(0, visibleCount), [cards, visibleCount]);

  return (
    <section className={styles.wrapper}>
      <div className={styles.hero}>
        <div className={styles.badge}>{badge}</div>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>

      <div className={styles.grid}>
        {visibleCards.map((card) => (
          <Link key={card.id} href={`/${locale}/news/${card.slug}`} className={styles.card}>
            <h2 className={styles.cardTitle}>{card.title}</h2>
            <p className={styles.cardSubtitle}>{card.subtitle}</p>
            {card.imageUrl ? <img src={card.imageUrl} alt={card.title} className={styles.cardImage} loading="lazy" /> : null}
          </Link>
        ))}
      </div>

      {visibleCount < cards.length ? (
        <div className={styles.actions}>
          <button type="button" className={styles.loadMoreButton} onClick={() => setVisibleCount((value) => value + STEP_COUNT)}>
            {loadMoreLabel}
          </button>
        </div>
      ) : null}
    </section>
  );
}