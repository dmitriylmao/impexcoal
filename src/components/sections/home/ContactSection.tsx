'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import styles from './ContactSection.module.css';

type ContactSectionProps = {
  badge: string;
  title: string;
  cta: string;
};

export default function ContactSection({ badge, title, cta }: ContactSectionProps) {
  const CONTACT_PHONE = '+79889451728';
  const CONTACT_PHONE_PLAIN = '79889451728';
  const params = useParams<{ lang?: string }>();
  const locale = params?.lang ?? 'ru';

  return (
    <section className={styles.root} aria-label={title}>
      <div className={styles.inner}>
        <div className={styles.badgeRow}>
          <span className={styles.badgeLine} />
          <span className={styles.badgeitalic}>
            {badge}
          </span>
          <span className={styles.badgeLine2} />
        </div>

        <h2 className={styles.title}>{title}</h2>

        <Link href={`/${locale}/contacts`} className={styles.ctaButton}>
          <div className={styles.glow} />
          <div className={styles.borderWrapper}>
            <div className={`${styles.stroke} ${styles.strokeDefault}`} />
            <div className={`${styles.stroke} ${styles.strokeHover}`} />
          </div>
          <div className={styles.innerFill} />
          <span className={styles.ctaLabel}>{cta || 'Связаться с менеджером'}</span>
        </Link>

        <div className={styles.socials}>
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
        </div>
      </div>

      <div className={styles.particles} aria-hidden="true" />
      
    </section>
  );
}
