import 'server-only';
import { i18n, type Locale } from '@/i18n/config';

type Dictionary = {
  header: {
    title: string;
    subtitle: string;
  };
  news: {
    title: string;
    empty: string;
    category: string;
    date: string;
  };
  switcher: {
    label: string;
  };
};

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  ru: () => import('./ru.json').then((module) => module.default as Dictionary),
  en: () => import('./en.json').then((module) => module.default as Dictionary),
  tr: () => import('./tr.json').then((module) => module.default as Dictionary),
};

export const getDictionary = async (locale: Locale) => dictionaries[locale]();

export const resolveLocale = (value: string): Locale => {
  return i18n.locales.includes(value as Locale) ? (value as Locale) : i18n.defaultLocale;
};
