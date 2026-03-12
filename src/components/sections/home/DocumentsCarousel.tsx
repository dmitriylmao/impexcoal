'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import styles from './DocumentsSection.module.css';

type Slide = {
  src: string;
  alt: string;
};

type DocumentsCarouselProps = {
  slides: Slide[];
};

export default function DocumentsCarousel({ slides }: DocumentsCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  if (slides.length === 0) {
    return null;
  }

  const activeSlide = slides[activeIndex];

  const goPrev = () => {
    setActiveIndex((current) => (current - 1 + slides.length) % slides.length);
  };

  const goNext = () => {
    setActiveIndex((current) => (current + 1) % slides.length);
  };

  return (
    <div className={styles.carousel} aria-live="polite">
      <button type="button" className={`${styles.navButton} ${styles.navButtonLeft}`} onClick={goPrev} aria-label="Предыдущий документ">
        <Image src="/icons/arrow-left.svg" alt="" width={20} height={20} className={styles.navIcon} aria-hidden />
      </button>

      <div className={styles.frame}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide.src}
            className={styles.slide}
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 1.015 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.99 }}
            transition={{ duration: reduceMotion ? 0.01 : 0.42, ease: [0.22, 1, 0.36, 1] }}
          >
            <a
              href={activeSlide.src}
              target="_blank"
              rel="noreferrer"
              className={styles.imageLink}
              aria-label={`${activeSlide.alt}. Открыть в новой вкладке`}
            >
              <Image src={activeSlide.src} alt={activeSlide.alt} fill className={styles.image} sizes="(max-width: 800px) 100vw, 1200px" priority={activeIndex === 0} />
            </a>
          </motion.div>
        </AnimatePresence>
      </div>

      <button type="button" className={`${styles.navButton} ${styles.navButtonRight}`} onClick={goNext} aria-label="Следующий документ">
        <Image src="/icons/arrow-left.svg" alt="" width={20} height={20} className={`${styles.navIcon} ${styles.navIconRight}`} aria-hidden />
      </button>
    </div>
  );
}
