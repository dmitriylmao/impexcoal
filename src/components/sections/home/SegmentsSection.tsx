'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';
import styles from './SegmentsSection.module.css';

type SegmentTab = {
  tab: string;
  title: string;
  description: string;
};

type SegmentsSectionProps = {
  badge: string;
  title: string;
  cta: string;
  tabs: SegmentTab[];
};

const images = ['/images/segment/s2.png', '/images/segment/s3.png', '/images/segment/s6.png'];

export default function SegmentsSection({ badge, title, cta, tabs }: SegmentsSectionProps) {
  const params = useParams<{ lang?: string }>();
  const locale = params?.lang ?? 'ru';
  const reduceMotion = useReducedMotion();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const panelInView = useInView(panelRef, { once: true, amount: 0.25 });
  const [active, setActive] = useState(0);
  const safeTabs = tabs.slice(0, 3);
  const activeTab = safeTabs[active] ?? safeTabs[0];

  const panelVariants = {
    hidden: { opacity: reduceMotion ? 1 : 0 },
    show: {
      opacity: 1,
      transition: {
        duration: reduceMotion ? 0.01 : 0.45,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  const imageFadeVariants = {
    hidden: { opacity: reduceMotion ? 1 : 0 },
    show: {
      opacity: 1,
      transition: {
        duration: reduceMotion ? 0.01 : 0.55,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  const titleContainerVariants = {
    hidden: { opacity: reduceMotion ? 1 : 0 },
    show: {
      opacity: 1,
      transition: {
        duration: reduceMotion ? 0.01 : 0.34,
        ease: [0.25, 0.1, 0.25, 1] as const,
        staggerChildren: reduceMotion ? 0 : 0.013,
        delayChildren: reduceMotion ? 0 : 0.02,
      },
    },
  };

  const descriptionContainerVariants = {
    hidden: { opacity: reduceMotion ? 1 : 0 },
    show: {
      opacity: 1,
      transition: {
        duration: reduceMotion ? 0.01 : 0.42,
        ease: [0.25, 0.1, 0.25, 1] as const,
        staggerChildren: reduceMotion ? 0 : 0.011,
        delayChildren: reduceMotion ? 0 : 0.14,
      },
    },
  };

  const wordVariants = {
    hidden: { opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 4 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduceMotion ? 0.01 : 0.12,
        ease: [0.25, 0.1, 0.25, 1] as const,
      },
    },
  };

  const textBlockVariants = {
    hidden: { opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduceMotion ? 0.01 : 0.5,
        ease: [0, 0.63, 0.46, 1] as const,
      },
    },
  };

  const splitWords = (value: string) => value.trim().split(/\s+/);

  return (
    <section className={styles.root} aria-label={title}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <span className={styles.badge}>
            <Image src="/icons/user-check.svg" alt="" width={14} height={14} className={styles.badgeIcon} aria-hidden />
            {badge}
          </span>
          <h2 className={styles.title}>{title}</h2>
        </div>

        <motion.div
          ref={panelRef}
          className={styles.panel}
          initial="hidden"
          animate={panelInView ? 'show' : 'hidden'}
          variants={panelVariants}
        >
          <div className={styles.tabs}>
            {safeTabs.map((item, index) => (
              <button
                key={item.tab}
                type="button"
                className={index === active ? `${styles.tabButton} ${styles.tabButtonActive}` : styles.tabButton}
                onClick={() => setActive(index)}
              >
                {item.tab}
              </button>
            ))}
          </div>

          <div className={styles.content}>
            <div className={styles.visual}>
              <div className={styles.mainImageWrap}>
                <motion.div
                  key={`main-${active}-${panelInView ? 'in' : 'out'}`}
                  style={{ position: 'absolute', inset: 0 }}
                  initial="hidden"
                  animate={panelInView ? 'show' : 'hidden'}
                  variants={imageFadeVariants}
                >
                  <Image
                    src={images[active] ?? images[0]}
                    alt={activeTab?.title ?? ''}
                    fill
                    className={styles.mainImage}
                    sizes="(max-width: 800px) 90vw, 40vw"
                  />
                </motion.div>
              </div>
            </div>

            <motion.div
              className={styles.text}
              key={`text-block-${active}-${panelInView ? 'in' : 'out'}`}
              initial="hidden"
              animate={panelInView ? 'show' : 'hidden'}
              variants={textBlockVariants}
            >
              <motion.h3
                key={`title-${active}-${panelInView ? 'in' : 'out'}`}
                className={styles.itemTitle}
                initial="hidden"
                animate={panelInView ? 'show' : 'hidden'}
                variants={titleContainerVariants}
              >
                {splitWords(activeTab?.title ?? '').map((token, index, arr) => (
                  <motion.span key={`title-word-${index}`} variants={wordVariants} style={{ display: 'inline-block' }}>
                    {token}
                    {index < arr.length - 1 ? '\u00A0' : ''}
                  </motion.span>
                ))}
              </motion.h3>
              <motion.p
                key={`desc-${active}-${panelInView ? 'in' : 'out'}`}
                className={styles.itemDescription}
                initial="hidden"
                animate={panelInView ? 'show' : 'hidden'}
                variants={descriptionContainerVariants}
              >
                {splitWords(activeTab?.description ?? '').map((token, index, arr) => (
                  <motion.span key={`desc-word-${index}`} variants={wordVariants} style={{ display: 'inline-block' }}>
                    {token}
                    {index < arr.length - 1 ? '\u00A0' : ''}
                  </motion.span>
                ))}
              </motion.p>
              <Link href={`/${locale}/contacts`} className={styles.ctaButton}>
                <div className={styles.glow}></div>

                <div className={styles.borderWrapper}>
                  <div className={`${styles.stroke} ${styles.strokeDefault}`}></div>
                  <div className={`${styles.stroke} ${styles.strokeHover}`}></div>
                </div>

                <div className={styles.innerFill}></div>

                <span className={styles.ctaLabel}>{cta}</span>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
