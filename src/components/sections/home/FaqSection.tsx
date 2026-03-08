'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './FaqSection.module.css';

type FaqItem = {
  question: string;
  answer: string;
};

type FaqSectionProps = {
  badge: string;
  title: string;
  items: FaqItem[];
  cardTitle: string;
  cardSubtitle: string;
  cardButton: string;
};

export default function FaqSection({ badge, title, items, cardTitle, cardSubtitle, cardButton }: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const safeItems = items.slice(0, 5);

  return (
    <section className={styles.root} aria-label={title}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <span className={styles.badge}>
            <Image src="/icons/book-open-text.svg" alt="" width={14} height={14} className={styles.badgeIcon} aria-hidden />
            {badge}
          </span>
          <h2 className={styles.title}>{title}</h2>
        </div>

        <div className={styles.content}>
          <div className={styles.faqList}>
            {safeItems.map((item, index) => {
              const isOpen = openIndex === index;

              return (
                <article key={item.question} className={isOpen ? `${styles.item} ${styles.itemOpen}` : styles.item}>
                  <button
                    type="button"
                    className={styles.trigger}
                    onClick={() => setOpenIndex((prev) => (prev === index ? null : index))}
                    aria-expanded={isOpen}
                  >
                    <span className={styles.question}>{item.question}</span>
                    <span className={isOpen ? `${styles.chevron} ${styles.chevronOpen}` : styles.chevron} aria-hidden="true" />
                  </button>

                  {isOpen ? (
                    <div className={styles.answerWrap}>
                      <p className={styles.answer}>{item.answer}</p>
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>

          <aside className={styles.ctaCard}>
            <div className={styles.ctaIcon}>?</div>
            <h3 className={styles.ctaTitle}>{cardTitle}</h3>
            <p className={styles.ctaSubtitle}>{cardSubtitle}</p>
            <button type="button" className={styles.ctaButton}>
              {cardButton}
              <span aria-hidden="true">↗</span>
            </button>
          </aside>
        </div>
      </div>
    </section>
  );
}

