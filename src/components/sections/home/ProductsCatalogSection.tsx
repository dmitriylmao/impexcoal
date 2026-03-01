'use client';

import { useEffect, useMemo, useState } from 'react';
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

const DESKTOP_MIN = 1200;
const TABLET_MIN = 800;

function getInitialVisibleCount(width: number) {
  if (width < TABLET_MIN) {
    return 3;
  }

  if (width <= DESKTOP_MIN) {
    return 2;
  }

  return 3;
}

export default function ProductsCatalogSection({
  badge,
  title,
  subtitle,
  showAllLabel,
  showLessLabel,
  modalCloseLabel,
  cards,
}: ProductsCatalogSectionProps) {
  const [visibleLimit, setVisibleLimit] = useState(3);
  const [expanded, setExpanded] = useState(false);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  useEffect(() => {
    const apply = () => {
      setVisibleLimit(getInitialVisibleCount(window.innerWidth));
    };

    apply();
    window.addEventListener('resize', apply);
    return () => window.removeEventListener('resize', apply);
  }, []);

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

  const canExpand = cards.length > visibleLimit;
  const visibleCards = useMemo(() => {
    if (!canExpand || expanded) {
      return cards;
    }

    return cards.slice(0, visibleLimit);
  }, [canExpand, cards, expanded, visibleLimit]);

  const activeCard = useMemo(() => cards.find((item) => item.slug === activeSlug) ?? null, [activeSlug, cards]);

  if (cards.length === 0) {
    return null;
  }

  return (
    <section className={styles.root} aria-label={title}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <span className={styles.badge}>{badge}</span>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>

        <div className={styles.grid}>
          {visibleCards.map((item) => (
            <button key={item.slug} type="button" className={styles.card} onClick={() => setActiveSlug(item.slug)}>
              <div className={styles.imageWrap}>
                <img src={item.imageUrl} alt={item.name} className={styles.image} loading="lazy" />
              </div>
              <h3 className={styles.cardTitle}>{item.name}</h3>
              <p className={styles.cardDescription}>{item.description}</p>
            </button>
          ))}
        </div>

        {canExpand ? (
          <div className={styles.actions}>
            <button type="button" className={styles.showAllButton} onClick={() => setExpanded((prev) => !prev)}>
              {expanded ? showLessLabel : showAllLabel}
            </button>
          </div>
        ) : null}
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
