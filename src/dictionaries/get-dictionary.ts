import 'server-only';
import { i18n, type Locale } from '@/i18n/config';
import type { SiteDictionary } from '@/dictionaries/types';

const dictionaries: Record<Locale, () => Promise<SiteDictionary>> = {
  ru: () => import('./ru.json').then((module) => module.default as SiteDictionary),
  en: () => import('./en.json').then((module) => module.default as SiteDictionary),
  tr: () => import('./tr.json').then((module) => module.default as SiteDictionary),
};

export const getDictionary = async (locale: Locale) => dictionaries[locale]();

export const resolveLocale = (value: string): Locale => {
  return i18n.locales.includes(value as Locale) ? (value as Locale) : i18n.defaultLocale;
};