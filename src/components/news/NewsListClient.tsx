'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
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
  const reduceMotion = useReducedMotion();

  const visibleCards = useMemo(() => cards.slice(0, visibleCount), [cards, visibleCount]);

  const cardVariants = {
    hidden: { opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 18 },
    show: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: reduceMotion ? 0.01 : 0.45,
        delay: reduceMotion ? 0 : Math.min(index, 5) * 0.05,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    }),
  };

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
        {visibleCards.map((card, index) => (
          <motion.div
            key={card.id}
            layout
            custom={index}
            initial={reduceMotion ? false : 'hidden'}
            animate="show"
            variants={cardVariants}
          >
            <Link href={`/${locale}/news/${card.slug}`} className={styles.card}>
              <h2 className={styles.cardTitle}>{card.title}</h2>
              <p className={styles.cardSubtitle}>{card.subtitle}</p>
              <p className={styles.cardDate}>{card.publishedAt}</p>
              {card.imageUrl ? <img src={card.imageUrl} alt={card.title} className={styles.cardImage} loading="lazy" /> : null}
            </Link>
          </motion.div>
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
