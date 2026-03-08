'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
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
  const params = useParams<{ lang?: string }>();
  const locale = params?.lang ?? 'ru';
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

                  <div className={isOpen ? `${styles.answerWrap} ${styles.answerWrapOpen}` : styles.answerWrap}>
                    <p className={styles.answer}>{item.answer}</p>
                  </div>
                </article>
              );
            })}
          </div>

          <aside className={styles.ctaCard}>
            <div className={styles.ctaIcon}>
              <Image src="/icons/question.svg" alt="" width={32} height={32} className={styles.ctaIconImage} aria-hidden />
            </div>
            <h3 className={styles.ctaTitle}>{cardTitle}</h3>
            <p className={styles.ctaSubtitle}>{cardSubtitle}</p>
            <Link href={`/${locale}/contacts`} className={styles.ctaButton}>
              <div className={styles.glow} />
              <div className={styles.borderWrapper}>
                <div className={`${styles.stroke} ${styles.strokeDefault}`} />
                <div className={`${styles.stroke} ${styles.strokeHover}`} />
              </div>
              <div className={styles.innerFill} />
              <span className={styles.ctaLabel}>{cardButton}</span>
              <Image src="/icons/arrow-up-right.svg" alt="" width={16} height={16} className={styles.ctaArrow} aria-hidden />
            </Link>
          </aside>
        </div>
      </div>
    </section>
  );
}


