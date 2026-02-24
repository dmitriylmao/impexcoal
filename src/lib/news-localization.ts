import type { Locale } from '@/i18n/config';

export type NewsItemForLocale = {
  title: string;
  content: string;
  translations: { locale: string; title: string; content: string }[];
};

export function getLocalizedNewsContent(item: NewsItemForLocale, locale: Locale, fallbackLocale: Locale = 'ru') {
  const exact = item.translations.find((translation) => translation.locale === locale);
  if (exact) {
    return exact;
  }

  const fallback = item.translations.find((translation) => translation.locale === fallbackLocale);
  if (fallback) {
    return fallback;
  }

  return { title: item.title, content: item.content };
}

export function normalizeImageUrl(value: string | null): string | null {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith('/')) {
    return trimmed;
  }

  return `/${trimmed}`;
}