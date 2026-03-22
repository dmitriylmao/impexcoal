import type { Locale } from '@/i18n/config';

type SiteSectionKey = 'news' | 'contacts' | 'privacy';

const HOME_TITLE_BY_LOCALE: Record<Locale, string> = {
  ru: 'ТД "ИМПЭКС" — Антрацит и марка Т от производителя',
  en: 'TD "IMPEKS" — International Anthracite & Thermal Coal Supply',
  tr: 'TD "IMPEKS" — Uluslararası Antrasit ve Kömür Tedariği',
};

const BRAND_BY_LOCALE: Record<Locale, string> = {
  ru: 'ТД "ИМПЭКС"',
  en: 'TD "IMPEKS"',
  tr: 'TD "IMPEKS"',
};

const SECTION_BY_LOCALE: Record<Locale, Record<SiteSectionKey, string>> = {
  ru: {
    news: 'Новости',
    contacts: 'Контакты',
    privacy: 'Политика конфиденциальности',
  },
  en: {
    news: 'News',
    contacts: 'Contacts',
    privacy: 'Privacy Policy',
  },
  tr: {
    news: 'Haberler',
    contacts: 'İletişim',
    privacy: 'Gizlilik Politikası',
  },
};

export function getHomeTitle(locale: Locale): string {
  return HOME_TITLE_BY_LOCALE[locale];
}

export function getSectionTitle(locale: Locale, section: SiteSectionKey): string {
  return `${BRAND_BY_LOCALE[locale]} — ${SECTION_BY_LOCALE[locale][section]}`;
}

export function getArticleTitle(locale: Locale, articleTitle: string): string {
  return `${articleTitle} — ${BRAND_BY_LOCALE[locale]}`;
}
