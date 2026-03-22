import type { MetadataRoute } from 'next';
import { i18n } from '@/i18n/config';
import { prisma } from '@/lib/prisma';
import { SITE_URL } from '@/lib/seo';

const STATIC_ROUTE_SUFFIXES = ['', '/contacts', '/news', '/privacy'] as const;

function buildLocalizedPath(locale: (typeof i18n.locales)[number], suffix: string): string {
  return `/${locale}${suffix}`;
}

function buildAlternates(pathByLocale: Record<(typeof i18n.locales)[number], string>) {
  return {
    languages: {
      ru: new URL(pathByLocale.ru, SITE_URL).toString(),
      en: new URL(pathByLocale.en, SITE_URL).toString(),
      tr: new URL(pathByLocale.tr, SITE_URL).toString(),
      'x-default': new URL(pathByLocale.ru, SITE_URL).toString(),
    },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const localizedStaticEntries: MetadataRoute.Sitemap = STATIC_ROUTE_SUFFIXES.flatMap((suffix) => {
    const pathByLocale = {
      ru: buildLocalizedPath('ru', suffix),
      en: buildLocalizedPath('en', suffix),
      tr: buildLocalizedPath('tr', suffix),
    };

    return i18n.locales.map((locale) => ({
      url: new URL(pathByLocale[locale], SITE_URL).toString(),
      lastModified: now,
      changeFrequency: suffix === '' ? 'weekly' : 'monthly',
      priority: suffix === '' ? 1 : 0.7,
      alternates: buildAlternates(pathByLocale),
    }));
  });

  try {
    const newsItems = await prisma.news.findMany({
      select: {
        slug: true,
        publishedAt: true,
      },
      orderBy: { publishedAt: 'desc' },
    });

    const localizedNewsEntries: MetadataRoute.Sitemap = newsItems.flatMap((item) => {
      const pathByLocale = {
        ru: `/ru/news/${item.slug}`,
        en: `/en/news/${item.slug}`,
        tr: `/tr/news/${item.slug}`,
      };

      return i18n.locales.map((locale) => ({
        url: new URL(pathByLocale[locale], SITE_URL).toString(),
        lastModified: item.publishedAt ?? now,
        changeFrequency: 'weekly',
        priority: 0.6,
        alternates: buildAlternates(pathByLocale),
      }));
    });

    return [...localizedStaticEntries, ...localizedNewsEntries];
  } catch {
    return localizedStaticEntries;
  }
}
