import ru from '@/dictionaries/ru.json';
import en from '@/dictionaries/en.json';
import tr from '@/dictionaries/tr.json';
import { i18n, isValidLocale, type Locale } from '@/i18n/config';
import type { SiteDictionary } from '@/dictionaries/types';

const uiDictionaries: Record<Locale, SiteDictionary> = {
  ru: ru as SiteDictionary,
  en: en as SiteDictionary,
  tr: tr as SiteDictionary,
};

export function getUiDictionary(localeLike: string | undefined): SiteDictionary {
  if (localeLike && isValidLocale(localeLike)) {
    return uiDictionaries[localeLike];
  }

  return uiDictionaries[i18n.defaultLocale];
}