export const i18n = {
  locales: ['ru', 'en', 'tr'] as const,
  defaultLocale: 'ru' as const,
};

export type Locale = (typeof i18n.locales)[number];

export function isValidLocale(value: string): value is Locale {
  return i18n.locales.includes(value as Locale);
}
