'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
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

const DECK_IMAGES = ['/image.png', '/image1.jpg', '/image2.jpg'] as const;

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

  useEffect(() => {
    setOrder(baseOrder);
  }, [baseOrder]);

  useEffect(() => {
    if (order.length < 2) {
      return;
    }

    const timer = setInterval(() => {
      setOrder((prev) => [...prev.slice(1), prev[0]]);
    }, 15000);

    return () => clearInterval(timer);
  }, [order.length]);

  const activateCard = (cardIndex: number) => {
    setOrder((prev) => reorderDeck(prev, cardIndex));
  };

  return (
    <section className={styles.root} aria-label={badge}>
      <div className={styles.inner}>
        <div className={styles.badgeRow}>
          <span className={styles.badge}>{badge}</span>
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
                        <div className={styles.metricBox}>
                          <strong className={styles.metricValue}>{card.metricValue}</strong>
                          <span className={styles.metricLabel}>{card.metricLabel}</span>
                        </div>
                      </div>

                      <div className={styles.cardMedia}>
                        <Image src={imageSrc} alt={card.imageAlt} fill className={styles.mediaImage} sizes="40vw" />
                      </div>
                    </div>
                  </div>
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
            <article key={index} className={styles.mobileCard}>
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
                <div className={styles.metricBox}>
                  <strong className={styles.metricValue}>{card.metricValue}</strong>
                  <span className={styles.metricLabel}>{card.metricLabel}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
