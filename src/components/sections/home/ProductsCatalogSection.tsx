'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
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
  const reduceMotion = useReducedMotion();

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

  const overlayVariants = {
    hidden: { opacity: reduceMotion ? 1 : 0 },
    show: {
      opacity: 1,
      transition: { duration: reduceMotion ? 0.01 : 0.28, ease: 'easeOut' as const },
    },
    exit: {
      opacity: 0,
      transition: { duration: reduceMotion ? 0.01 : 0.2, ease: 'easeOut' as const },
    },
  };

  const modalVariants = {
    hidden: { opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 26, scale: reduceMotion ? 1 : 0.97 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: reduceMotion ? 0.01 : 0.42, ease: [0.22, 1, 0.36, 1] as const },
    },
    exit: {
      opacity: 0,
      y: reduceMotion ? 0 : 16,
      scale: reduceMotion ? 1 : 0.985,
      transition: { duration: reduceMotion ? 0.01 : 0.22, ease: [0.4, 0, 0.2, 1] as const },
    },
  };

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

      <AnimatePresence>
        {activeCard ? (
          <motion.div
            className={styles.modalOverlay}
            onClick={() => setActiveSlug(null)}
            role="presentation"
            initial="hidden"
            animate="show"
            exit="exit"
            variants={overlayVariants}
          >
            <motion.div
              className={styles.modal}
              onClick={(event) => event.stopPropagation()}
              role="dialog"
              aria-modal="true"
              initial="hidden"
              animate="show"
              exit="exit"
              variants={modalVariants}
            >
              <button type="button" className={styles.modalClose} onClick={() => setActiveSlug(null)} aria-label={modalCloseLabel}>
                <Image src="/icons/x.svg" alt="" width={16} height={16} className={styles.modalCloseIcon} aria-hidden />
              </button>

              <div className={styles.modalImageWrap}>
                <img src={activeCard.imageUrl} alt={activeCard.name} className={styles.modalImage} loading="lazy" />
              </div>

              <h3 className={styles.modalTitle}>{activeCard.name}</h3>
              <div className={styles.modalBody}>
                <p>{activeCard.description}</p>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
