'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { scrollToSection } from '@/lib/scroll-to-section';
import styles from './HeroSection.module.css';

type HeroSectionProps = {
  title: string;
  subtitle: string;
  cta: string;
  scrollLabel: string;
};

export default function HeroSection({ title, subtitle, cta, scrollLabel }: HeroSectionProps) {
  const params = useParams<{ lang?: string }>();
  const locale = params?.lang ?? 'ru';

  const scrollNext = () => {
    scrollToSection('next-block');
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

            <div className={styles.actionRow}>
            <Link href={`/${locale}/contacts`} className={styles.ctaButton}>
              <div className={styles.glow}></div>
              
              <div className={styles.borderWrapper}>
                <div className={`${styles.stroke} ${styles.strokeDefault}`}></div>
                <div className={`${styles.stroke} ${styles.strokeHover}`}></div>
              </div>
              
              <div className={styles.innerFill}></div>
              
              <span className={styles.ctaLabel}>{cta}</span>
            </Link>
          </div>

          </div>


          {/* Социальные сети и контакты */}
          <div className={styles.socials}>
            <a href="tel:+79508655519" className={styles.socialButton} aria-label="Call us">
              <div className={styles.iconWrapper}>
                <Image src="/icons/phone.svg" alt="" width={24} height={24} className={styles.iconDefault} />
                <Image src="/icons/phone.svg" alt="" width={24} height={24} className={styles.iconHover} />
              </div>
            </a>

            <span className={styles.divider} />

            <a 
              href="https://t.me/wwwwwwwwwwwwwwwwwwvwwwwwwwwwww" 
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

            <a href="mailto:tdimpeks@support.com" className={styles.socialButton} aria-label="Send email">
              <div className={styles.iconWrapper}>
                <Image src="/icons/hero-mail.svg" alt="" width={24} height={24} className={styles.iconDefault} />
                <Image src="/icons/hero-mail.svg" alt="" width={24} height={24} className={styles.iconHover} />
              </div>
            </a>
          </div>
        

          <button type="button" className={styles.scrollButton} onClick={scrollNext} aria-label={scrollLabel}>
            <span className={styles.chevron} aria-hidden />
          </button>
        </div>

        
      </div>
    </section>
  );
}
