'use client';

import Image from 'next/image';
import styles from './HeroSection.module.css';

type HeroSectionProps = {
  title: string;
  subtitle: string;
  cta: string;
  scrollLabel: string;
};

export default function HeroSection({ title, subtitle, cta, scrollLabel }: HeroSectionProps) {
  const scrollNext = () => {
    const nextBlock = document.getElementById('next-block');
    if (!nextBlock) {
      return;
    }

    nextBlock.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className={styles.root}>
      <div className={styles.inner}>
        <div className={styles.content}>
          <div className={styles.logoWrap}>
            <div className={styles.logoGlow} />
            <Image src="/logo.png" alt="IMPEKS" width={98} height={98} className={styles.mainLogo} priority />
          </div>

          <div className={styles.textBlock}>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.subtitle}>{subtitle}</p>
          </div>

          <div className={styles.actionRow}>
            <button type="button" className={styles.ctaButton}>
              {cta}
            </button>
          </div>

          <div className={styles.socials}>
            <button type="button" className={styles.socialButton} aria-label="Telegram">
              <Image src="/telegram.svg" alt="" width={20} height={20} className={styles.telegramIcon} />
            </button>

            <span className={styles.divider} />

            <button type="button" className={styles.socialButton} aria-label="Telegram">
              <Image src="/telegram.svg" alt="" width={20} height={20} className={styles.telegramIcon} />
            </button>

            <span className={styles.divider} />

            <button type="button" className={styles.socialButton} aria-label="Telegram">
              <Image src="/telegram.svg" alt="" width={20} height={20} className={styles.telegramIcon} />
            </button>
          </div>
        </div>

        <button type="button" className={styles.scrollButton} onClick={scrollNext} aria-label={scrollLabel}>
          <span className={styles.chevron} aria-hidden />
        </button>
      </div>
    </section>
  );
}
