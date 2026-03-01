import type { Locale } from '@/i18n/config';

export type ProductItemForLocale = {
  slug: string;
  translations: { locale: string; name: string; description: string }[];
};

export function getLocalizedProductContent(item: ProductItemForLocale, locale: Locale, fallbackLocale: Locale = 'ru') {
  const exact = item.translations.find((translation) => translation.locale === locale);
  if (exact) {
    return exact;
  }

  const fallback = item.translations.find((translation) => translation.locale === fallbackLocale);
  if (fallback) {
    return fallback;
  }

  const first = item.translations[0];
  if (first) {
    return first;
  }

  return {
    locale,
    name: item.slug,
    description: '',
  };
}
