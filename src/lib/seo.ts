import type { Metadata } from 'next';
import type { Locale } from '@/i18n/config';

type SiteSectionKey = 'news' | 'contacts' | 'privacy';

const HOME_TITLE_BY_LOCALE: Record<Locale, string> = {
  ru: '\u0422\u0414 "\u0418\u041c\u041f\u042d\u041a\u0421" \u2014 \u0410\u043d\u0442\u0440\u0430\u0446\u0438\u0442 \u0438 \u043c\u0430\u0440\u043a\u0430 \u0422 \u043e\u0442 \u043f\u0440\u043e\u0438\u0437\u0432\u043e\u0434\u0438\u0442\u0435\u043b\u044f',
  en: 'TD IMPEX \u2014 International Anthracite & Thermal Coal Supply',
  tr: 'TD IMPEX \u2014 Uluslararas\u0131 Antrasit ve K\u00f6m\u00fcr Tedari\u011fi',
};

const BRAND_BY_LOCALE: Record<Locale, string> = {
  ru: '\u0422\u0414 "\u0418\u041c\u041f\u042d\u041a\u0421"',
  en: 'TD IMPEX',
  tr: 'TD IMPEX',
};

const SECTION_BY_LOCALE: Record<Locale, Record<SiteSectionKey, string>> = {
  ru: {
    news: '\u041d\u043e\u0432\u043e\u0441\u0442\u0438',
    contacts: '\u041a\u043e\u043d\u0442\u0430\u043a\u0442\u044b',
    privacy: '\u041f\u043e\u043b\u0438\u0442\u0438\u043a\u0430 \u043a\u043e\u043d\u0444\u0438\u0434\u0435\u043d\u0446\u0438\u0430\u043b\u044c\u043d\u043e\u0441\u0442\u0438',
  },
  en: {
    news: 'News',
    contacts: 'Contacts',
    privacy: 'Privacy Policy',
  },
  tr: {
    news: 'Haberler',
    contacts: '\u0130leti\u015fim',
    privacy: 'Gizlilik Politikas\u0131',
  },
};

const DEFAULT_DESCRIPTION_BY_LOCALE: Record<Locale, string> = {
  ru: '\u0410\u043d\u0442\u0440\u0430\u0446\u0438\u0442 \u0438 \u043c\u0430\u0440\u043a\u0430 \u0422 \u043e\u0442 \u043f\u0440\u043e\u0438\u0437\u0432\u043e\u0434\u0438\u0442\u0435\u043b\u044f',
  en: 'International anthracite and thermal coal supply',
  tr: 'Uluslararas\u0131 antrasit ve k\u00f6m\u00fcr tedariki',
};

export const DEFAULT_OG_TITLE = '\u0422\u0414 \u0418\u041c\u041f\u042d\u041a\u0421';
export const DEFAULT_OG_IMAGE = '/OG2.jpg';

function getBaseUrl(): URL {
  const primaryUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const vercelHost = process.env.VERCEL_URL?.trim();
  const resolved = primaryUrl ?? (vercelHost ? `https://${vercelHost}` : undefined);

  if (resolved) {
    const normalized = resolved.replace(/\/+$/, '');
    return new URL(normalized);
  }

  return new URL('https://impexcoal.com');
}

export const SITE_URL = getBaseUrl();

export function getHomeTitle(locale: Locale): string {
  return HOME_TITLE_BY_LOCALE[locale];
}

export function getSectionTitle(locale: Locale, section: SiteSectionKey): string {
  return `${BRAND_BY_LOCALE[locale]} \u2014 ${SECTION_BY_LOCALE[locale][section]}`;
}

export function getArticleTitle(locale: Locale, articleTitle: string): string {
  return `${articleTitle} \u2014 ${BRAND_BY_LOCALE[locale]}`;
}

export function getDefaultDescription(locale: Locale): string {
  return DEFAULT_DESCRIPTION_BY_LOCALE[locale];
}

export function getDefaultOgDescription(locale: Locale): string {
  return DEFAULT_DESCRIPTION_BY_LOCALE[locale];
}

export function getLocaleAlternates(
  pathForLocale: Record<Locale, string>,
  locale: Locale
): Metadata['alternates'] {
  return {
    canonical: pathForLocale[locale],
    languages: {
      ru: pathForLocale.ru,
      en: pathForLocale.en,
      tr: pathForLocale.tr,
      'x-default': pathForLocale.ru,
    },
  };
}

