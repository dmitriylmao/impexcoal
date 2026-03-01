'use client';

import Image from 'next/image';
import styles from './ContactSection.module.css';

type ContactSectionProps = {
  badge: string;
  title: string;
  cta: string;
};

export default function ContactSection({ badge, title, cta }: ContactSectionProps) {
  return (
    <section className={styles.root} aria-label={title}>
      <div className={styles.inner}>
        <div className={styles.badgeRow}>
          <span className={styles.badgeLine} />
          <span className={styles.badge}>{badge}</span>
          <span className={styles.badgeLine} />
        </div>

        <h2 className={styles.title}>{title}</h2>

        <button type="button" className={styles.ctaButton}>
          {cta}
        </button>

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
    </section>
  );
}
