'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import type { Locale } from '@/i18n/config';
import styles from './CookieConsentBanner.module.css';

const COOKIE_CONSENT_KEY = 'impex-coal-cookies';
const LEGACY_COOKIE_CONSENT_KEY = 'impex-cookie-consent-v1';

type ConsentState = 'pending' | 'show' | 'hidden';

export default function CookieConsentBanner({ locale }: { locale: Locale }) {
  const [consentState, setConsentState] = useState<ConsentState>('pending');
  const [isMounted, setIsMounted] = useState(false);

  const copy = useMemo(() => {
    if (locale === 'en') {
      return {
        before: 'We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies and ',
        link: 'Privacy Policy',
        after: '.',
        accept: 'Accept',
      };
    }

    if (locale === 'tr') {
      return {
        before: 'Size daha iyi bir deneyim sunabilmek için çerezleri kullanıyoruz. Sitemizi kullanmaya devam ederek ',
        link: 'Gizlilik Politikamızı',
        after: ' ve çerez kullanımını kabul etmiş sayılırsınız.',
        accept: 'Kabul Et',
      };
    }

    return {
      before: 'Мы используем файлы cookie, чтобы сделать ваш опыт работы с сайтом лучше. Продолжая просмотр, вы соглашаетесь с нашей ',
      link: 'Политикой конфиденциальности',
      after: '.',
      accept: 'Принять',
    };
  }, [locale]);

  useEffect(() => {
    setIsMounted(true);
    console.log('Проверка наличия куки...');

    let consentValue: string | null = null;
    try {
      consentValue = window.localStorage.getItem(COOKIE_CONSENT_KEY);
      const legacyValue = window.localStorage.getItem(LEGACY_COOKIE_CONSENT_KEY);
      if (!consentValue && legacyValue === '1') {
        consentValue = 'accepted';
        window.localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
      }
    } catch {
      consentValue = null;
    }

    console.log(`Состояние согласия: ${consentValue ?? 'null'}`);
    const accepted = consentValue === 'accepted';
    if (accepted) {
      setConsentState('hidden');
      console.log('Компонент смонтирован, показываем: false');
      return;
    }

    const timer = window.setTimeout(() => {
      setConsentState('show');
      console.log('Компонент смонтирован, показываем: true');
    }, 2000);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const onShowBanner = () => {
      setConsentState('show');
      console.log('Компонент смонтирован, показываем: true');
    };

    window.addEventListener('impex-show-cookie-banner', onShowBanner as EventListener);
    return () => window.removeEventListener('impex-show-cookie-banner', onShowBanner as EventListener);
  }, []);

  const acceptConsent = () => {
    try {
      window.localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    } catch {
      // localStorage may be blocked in strict browser privacy modes
    }
    setConsentState('hidden');
  };

  if (!isMounted || consentState !== 'show' || typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <motion.aside
      className={styles.root}
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      initial={{ opacity: 0, x: -18, y: 24 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <p className={styles.text}>
        {copy.before}
        <Link href={`/${locale}/privacy`} className={styles.link}>
          {copy.link}
        </Link>
        {copy.after}
      </p>

      <button type="button" className={styles.acceptButton} onClick={acceptConsent}>
        <span className={styles.glow} />
        <span className={styles.borderWrapper}>
          <span className={`${styles.stroke} ${styles.strokeDefault}`} />
          <span className={`${styles.stroke} ${styles.strokeHover}`} />
        </span>
        <span className={styles.innerFill} />
        <span className={styles.acceptLabel}>{copy.accept}</span>
      </button>
    </motion.aside>,
    document.body
  );
}
