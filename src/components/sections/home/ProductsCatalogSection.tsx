'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import styles from './ProductsCatalogSection.module.css';

type ProductCard = {
  slug: string;
  name: string;
  description: string;
  imageUrl: string;
};

type ProductsCatalogSectionProps = {
  badge: string;
  title: string;
  subtitle: string;
  showAllLabel: string;
  showLessLabel: string;
  modalCloseLabel: string;
  cards: ProductCard[];
};

export default function ProductsCatalogSection({
  badge,
  title,
  subtitle,
  modalCloseLabel,
  cards,
}: ProductsCatalogSectionProps) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  useEffect(() => {
    if (!activeSlug) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveSlug(null);
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [activeSlug]);

  const activeCard = useMemo(() => cards.find((item) => item.slug === activeSlug) ?? null, [activeSlug, cards]);

  if (cards.length === 0) {
    return null;
  }

  return (
    <section className={styles.root} aria-label={title}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <span className={styles.badge}>
            <Image src="/icons/stack.svg" alt="" width={14} height={14} className={styles.badgeIcon} aria-hidden />
            {badge}
          </span>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>

        <div className={styles.grid}>
          {cards.map((item) => (
            <button key={item.slug} type="button" className={styles.card} onClick={() => setActiveSlug(item.slug)}>
              <div className={styles.imageWrap}>
                <img src={item.imageUrl} alt={item.name} className={styles.image} loading="lazy" />
              </div>
              <h3 className={styles.cardTitle}>{item.name}</h3>
              <p className={styles.cardDescription}>{item.description}</p>
            </button>
          ))}
        </div>
      </div>

      {activeCard ? (
        <div className={styles.modalOverlay} onClick={() => setActiveSlug(null)} role="presentation">
          <div className={styles.modal} onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true">
            <button type="button" className={styles.modalClose} onClick={() => setActiveSlug(null)} aria-label={modalCloseLabel}>
              <span aria-hidden="true">×</span>
            </button>

            <div className={styles.modalImageWrap}>
              <img src={activeCard.imageUrl} alt={activeCard.name} className={styles.modalImage} loading="lazy" />
            </div>

            <h3 className={styles.modalTitle}>{activeCard.name}</h3>
            <div className={styles.modalBody}>
              <p>{activeCard.description}</p>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
