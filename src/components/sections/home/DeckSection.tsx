'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import styles from './DeckSection.module.css';

type DeckCard = {
  title: string;
  description: string;
  metricValue: string;
  metricLabel: string;
  imageAlt: string;
};

type DeckSectionProps = {
  badge: string;
  cards: DeckCard[];
};

const DECK_IMAGES = ['/images/deck/d0_1final.png', '/images/deck/d3_3final.png', '/images/deck/d2_2final.png'] as const;

function reorderDeck(current: number[], selected: number): number[] {
  if (current[0] === selected) {
    return current;
  }

  const front = current[0];
  const middle = current.filter((index) => index !== selected && index !== front);
  return [selected, ...middle, front];
}

export default function DeckSection({ badge, cards }: DeckSectionProps) {
  const baseOrder = useMemo(() => cards.map((_, index) => index), [cards]);
  const [order, setOrder] = useState<number[]>(baseOrder);
  const reduceMotion = useReducedMotion();

  const sectionVariants = {
    hidden: {},
    show: {
      transition: {
        duration: reduceMotion ? 0.01 : 0.45,
        ease: [0.22, 1, 0.36, 1] as const,
        staggerChildren: reduceMotion ? 0 : 0.14,
        delayChildren: reduceMotion ? 0 : 0.1,
      },
    },
  };

  const desktopCardVariants = {
    hidden: {
      y: reduceMotion ? 0 : 72,
      scale: reduceMotion ? 1 : 0.94,
      rotateX: reduceMotion ? 0 : 7,
    },
    show: (index: number) => ({
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        duration: reduceMotion ? 0.01 : 1.25,
        delay: reduceMotion ? 0 : 0.08 + index * 0.14,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    }),
  };

  const mobileCardVariants = {
    hidden: {
      y: reduceMotion ? 0 : 52,
      scale: reduceMotion ? 1 : 0.95,
      rotateX: reduceMotion ? 0 : 5,
    },
    show: (index: number) => ({
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        duration: reduceMotion ? 0.01 : 1.1,
        delay: reduceMotion ? 0 : 0.06 + index * 0.12,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    }),
  };

  useEffect(() => {
    setOrder(baseOrder);
  }, [baseOrder]);

  useEffect(() => {
    if (order.length < 2) {
      return;
    }

    const timer = setInterval(() => {
      setOrder((prev) => [...prev.slice(1), prev[0]]);
    }, 20000);

    return () => clearInterval(timer);
  }, [order.length]);

  const hasMetricValue = (value: string) => value.trim().length > 0;

  const activateCard = (cardIndex: number) => {
    setOrder((prev) => reorderDeck(prev, cardIndex));
  };

  return (
    <motion.section
      className={styles.root}
      aria-label={badge}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      variants={sectionVariants}
    >
      <div className={styles.inner}>
        <div className={styles.badgeRow}>
          <span className={styles.badge}>
            <Image src="/icons/truck.svg" alt="" width={14} height={14} className={styles.badgeIcon} aria-hidden />
            {badge}
          </span>
        </div>

        <div className={styles.desktopDeck}>
          <div className={styles.stage}>
            {order.map((cardIndex, stackIndex) => {
              const card = cards[cardIndex];
              const imageSrc = DECK_IMAGES[cardIndex % DECK_IMAGES.length];
              const positionClass =
                stackIndex === 0 ? styles.positionFront : stackIndex === 1 ? styles.positionMiddle : styles.positionBack;

              return (
                <article
                  key={cardIndex}
                  className={`${styles.deckCard} ${positionClass}`}
                  onClick={() => activateCard(cardIndex)}
                >
                  <motion.div className={styles.cardAnimWrap} custom={stackIndex} variants={desktopCardVariants}>
                    <div className={styles.cardShell}>
                    <div className={styles.cardTop}>
                      <span className={styles.cardArrow} />
                      <span className={styles.cardDots}>
                        <i />
                        <i />
                        <i />
                      </span>
                    </div>

                    <div className={styles.cardBody}>
                      <div className={styles.cardText}>
                        <h3 className={styles.cardTitle}>{card.title}</h3>
                        <p className={styles.cardDescription}>{card.description}</p>
                        <div className={hasMetricValue(card.metricValue) ? styles.metricBox : `${styles.metricBox} ${styles.metricBoxSingle}`}>
                          {hasMetricValue(card.metricValue) ? (
                            <strong className={styles.metricValue}>{card.metricValue}</strong>
                          ) : null}
                          <span
                            className={
                              hasMetricValue(card.metricValue)
                                ? styles.metricLabel
                                : `${styles.metricLabel} ${styles.metricLabelSingle}`
                            }
                          >
                            {card.metricLabel}
                          </span>
                        </div>
                      </div>

                      <div className={styles.cardMedia}>
                        <Image
                          src={imageSrc}
                          alt={card.imageAlt}
                          width={1200}
                          height={700}
                          className={styles.mediaImage}
                          sizes="(max-width: 1200px) 100vw, 50vw"
                        />
                      </div>
                    </div>
                    </div>
                  </motion.div>
                </article>
              );
            })}
          </div>

          <div className={styles.navDots}>
            {cards.map((_, index) => (
              <button
                key={index}
                type="button"
                className={order[0] === index ? `${styles.dot} ${styles.dotActive}` : styles.dot}
                onClick={() => activateCard(index)}
                onMouseDown={(event) => event.stopPropagation()}
                aria-label={`Slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <div className={styles.mobileList}>
          {cards.map((card, index) => (
            <motion.article key={index} className={styles.mobileCard} custom={index} variants={mobileCardVariants}>
              <div className={styles.cardTop}>
                <span className={styles.cardArrow} />
                <span className={styles.cardDots}>
                  <i />
                  <i />
                  <i />
                </span>
              </div>

              <div className={styles.mobileBody}>
                <h3 className={styles.cardTitle}>{card.title}</h3>
                <p className={styles.cardDescription}>{card.description}</p>
                <div className={hasMetricValue(card.metricValue) ? styles.metricBox : `${styles.metricBox} ${styles.metricBoxSingle}`}>
                  {hasMetricValue(card.metricValue) ? (
                    <strong className={styles.metricValue}>{card.metricValue}</strong>
                  ) : null}
                  <span
                    className={
                      hasMetricValue(card.metricValue)
                        ? styles.metricLabel
                        : `${styles.metricLabel} ${styles.metricLabelSingle}`
                    }
                  >
                    {card.metricLabel}
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
