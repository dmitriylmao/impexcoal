'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { useMemo, useState } from 'react';
import type { BentoDocument } from './BentoDocsGrid';
import styles from './BentoDocsGrid.module.css';

type BentoDocsGridClientProps = {
  badge: string;
  emptyLabel: string;
  downloadLabel: string;
  documents: BentoDocument[];
};

const spring = { type: 'spring', stiffness: 260, damping: 20 } as const;

export default function BentoDocsGridClient({ badge, emptyLabel, downloadLabel, documents }: BentoDocsGridClientProps) {
  const reduceMotion = useReducedMotion();
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  const cards = useMemo(
    () => {
      const anthracite = documents
        .filter((document) => document.group === 'anthracite')
        .sort((a, b) => a.order - b.order);

      const coal = documents.filter((document) => document.group === 'coal').sort((a, b) => a.order - b.order);

      return [...anthracite, ...coal];
    },
    [documents],
  );

  const columns = useMemo(() => {
    const topRow = cards.slice(0, 4);
    const bottomRow = cards.slice(4, 8);

    return Array.from({ length: 4 }, (_, columnIndex) => {
      const topCard = topRow[columnIndex];
      const bottomCard = bottomRow[columnIndex];

      return [topCard, bottomCard].filter((card): card is BentoDocument => Boolean(card));
    });
  }, [cards]);

  return (
    <section className={styles.root} aria-label={badge}>
      <div className={styles.inner}>
        <span className={styles.badge}>
          <Image src="/icons/check.svg" alt="" width={14} height={14} className={styles.badgeIcon} aria-hidden />
          {badge}
        </span>

        {cards.length > 0 ? (
          <div className={styles.grid}>
            {columns.map((columnCards, columnIndex) => (
              <div key={`column-${columnIndex}`} className={styles.column}>
                {columnCards.map((card, rowIndex) => {
                  const showPreview = activeCardId === card.id;
                  const activeInColumn = columnCards.some((columnCard) => columnCard.id === activeCardId);
                  const isCompressed = activeInColumn && activeCardId !== card.id;
                  const cardIndex = rowIndex * 4 + columnIndex;

                  return (
                    <motion.article
                      key={card.id}
                      className={`${styles.card} ${showPreview ? styles.cardExpanded : ''} ${isCompressed ? styles.cardCompressed : ''}`}
                      layout={!reduceMotion}
                      initial={reduceMotion ? false : { opacity: 0, y: 28 }}
                      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                      viewport={reduceMotion ? undefined : { once: true, amount: 0.24 }}
                      transition={reduceMotion ? undefined : { duration: 0.52, delay: cardIndex * 0.08, ease: [0.22, 1, 0.36, 1] }}
                      whileHover={reduceMotion ? undefined : { scale: 1.02, transition: spring }}
                      onHoverStart={() => setActiveCardId(card.id)}
                      onHoverEnd={() => setActiveCardId((current) => (current === card.id ? null : current))}
                      onFocusCapture={() => setActiveCardId(card.id)}
                      onBlurCapture={() => setActiveCardId((current) => (current === card.id ? null : current))}
                    >
                  <a
                    href={card.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.cardLink}
                    aria-label={`${card.title}. Open PDF in new tab`}
                  />

                  <a
                    href={card.href}
                    download
                    className={styles.downloadButton}
                    aria-label={`${card.title}. ${downloadLabel}`}
                    title={downloadLabel}
                    onClick={(event) => event.stopPropagation()}
                  >
                    <Image src="/icons/download.svg" alt="" width={18} height={18} className={styles.downloadIcon} aria-hidden />
                  </a>

                  <motion.div
                    className={styles.topBar}
                    initial={false}
                    animate={
                      reduceMotion
                        ? { opacity: showPreview ? 0 : 1 }
                        : showPreview
                          ? { opacity: 0, y: -12 }
                          : { opacity: 1, y: 0 }
                    }
                    transition={{ duration: reduceMotion ? 0.01 : 0.26, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <span className={styles.fileChip}>
                      <Image src="/icons/file-pdf.svg" alt="" width={18} height={18} className={styles.fileIcon} aria-hidden />
                      PDF
                    </span>
                  </motion.div>

                  <motion.div
                    className={styles.certificateWrap}
                    initial={false}
                    animate={
                      reduceMotion
                        ? { opacity: showPreview ? 0 : 1 }
                        : showPreview
                          ? { opacity: 0, scale: 0.9 }
                          : { opacity: 1, scale: 1 }
                    }
                    transition={{ duration: reduceMotion ? 0.01 : 0.26, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className={styles.certificateInner}>
                      <Image
                        src="/icons/certificateBento.svg"
                        alt=""
                        width={132}
                        height={132}
                        className={styles.certificateIcon}
                        aria-hidden
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    className={styles.content}
                    initial={false}
                    animate={
                      reduceMotion
                        ? { opacity: 1, y: 0 }
                        : showPreview
                          ? { opacity: 0, y: 18 }
                          : { opacity: 1, y: 0 }
                    }
                    transition={{ duration: reduceMotion ? 0.01 : 0.28, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <h3 className={styles.title}>{card.title}</h3>
                  </motion.div>

                      {card.previewHref ? (
                        <motion.div
                          className={styles.preview}
                          initial={false}
                          animate={
                            reduceMotion
                              ? { opacity: 1, y: 0 }
                              : showPreview
                                ? { opacity: 1, y: 0 }
                                : { opacity: 0, y: 64 }
                          }
                          transition={spring}
                        >
                          <Image
                            src={card.previewHref}
                            alt={card.title}
                            fill
                            className={styles.previewImage}
                            sizes="(max-width: 800px) 100vw, (max-width: 1200px) 50vw, 35vw"
                          />
                        </motion.div>
                      ) : (
                        <div className={styles.previewFallback} aria-hidden />
                      )}
                    </motion.article>
                  );
                })}
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.empty}>{emptyLabel}</p>
        )}
      </div>
    </section>
  );
}
