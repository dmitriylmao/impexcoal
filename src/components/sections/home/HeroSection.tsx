'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import { scrollToSection } from '@/lib/scroll-to-section';
import styles from './HeroSection.module.css';

type HeroSectionProps = {
  title: string;
  subtitle: string;
  cta: string;
  scrollLabel: string;
};

export default function HeroSection({ title, subtitle, cta, scrollLabel }: HeroSectionProps) {
  const CONTACT_PHONE = '+79889451728';
  const CONTACT_PHONE_PLAIN = '79889451728';
  const params = useParams<{ lang?: string }>();
  const locale = params?.lang ?? 'ru';
  const reduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        duration: reduceMotion ? 0.01 : 0.5,
        ease: 'easeOut' as const,
        staggerChildren: reduceMotion ? 0 : 0.22,
        delayChildren: reduceMotion ? 0 : 0.18,
      },
    },
  };

  const scaleFadeVariants = {
    hidden: { opacity: 0, scale: reduceMotion ? 1 : 0.96 },
    show: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: reduceMotion ? 0.01 : 0.9,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  const logoVariants = {
    hidden: { opacity: 0, scale: reduceMotion ? 1 : 0.94 },
    show: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: reduceMotion ? 0.01 : 1.0,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  const videoVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        duration: reduceMotion ? 0.01 : 1.1,
        ease: 'easeOut' as const,
        delay: reduceMotion ? 0 : 0.4,
      },
    },
  };

  const scrollNext = () => {
    scrollToSection('next-block');
  };

  return (
    <section className={styles.root}>
      <motion.video
        className={styles.bgVideo}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden
        initial="hidden"
        animate="show"
        variants={videoVariants}
      >
        <source src="/hero3.webm" type="video/webm" />
      </motion.video>
      <div className={styles.inner}>
        <motion.div className={styles.content} initial="hidden" animate="show" variants={containerVariants}>
          <motion.div className={styles.logoWrap} variants={logoVariants}>
            <div className={styles.logoGlow} />
            <span className={styles.mainLogo} aria-hidden />
          </motion.div>

          <motion.div className={styles.textBlock} variants={scaleFadeVariants}>
            <motion.h1 className={styles.title} variants={scaleFadeVariants}>
              {title}
            </motion.h1>
            <motion.p className={styles.subtitle} variants={scaleFadeVariants}>
              {subtitle}
            </motion.p>

            <motion.div className={styles.actionRow} variants={scaleFadeVariants}>
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
          </motion.div>

          <motion.div className={styles.socials} variants={scaleFadeVariants}>
            <a href={`tel:${CONTACT_PHONE}`} className={styles.socialButton} aria-label="Call us">
              <div className={styles.iconWrapper}>
                <Image src="/icons/phone.svg" alt="" width={24} height={24} className={styles.iconDefault} />
                <Image src="/icons/phone.svg" alt="" width={24} height={24} className={styles.iconHover} />
              </div>
            </a>

            <span className={styles.divider} />

            <a
              href={`https://t.me/+${CONTACT_PHONE_PLAIN}`}
              className={styles.socialButton}
              aria-label="Write to Telegram"
              target="_blank"
              rel="noreferrer"
            >
              <div className={styles.iconWrapper}>
                <Image src="/icons/telegram.svg" alt="" width={24} height={24} className={styles.iconDefault} />
                <Image src="/icons/telegram.svg" alt="" width={24} height={24} className={styles.iconHover} />
              </div>
            </a>

            <span className={styles.divider} />

            <a href={`tel:${CONTACT_PHONE}`} className={styles.socialButton} aria-label="Call us">
              <div className={styles.iconWrapper}>
                <Image src="/icons/hero-mail.svg" alt="" width={24} height={24} className={styles.iconDefault} />
                <Image src="/icons/hero-mail.svg" alt="" width={24} height={24} className={styles.iconHover} />
              </div>
            </a>
          </motion.div>

          <motion.button
            type="button"
            className={styles.scrollButton}
            onClick={scrollNext}
            aria-label={scrollLabel}
            variants={scaleFadeVariants}
          >
            <span className={styles.chevron} aria-hidden />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
