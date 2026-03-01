import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getDictionary } from '@/dictionaries/get-dictionary';
import { i18n, isValidLocale, type Locale } from '@/i18n/config';
import { getLocalizedNewsContent, normalizeImageUrl } from '@/lib/news-localization';
import NewsListClient from '@/components/news/NewsListClient';

export default async function NewsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;

  if (!isValidLocale(lang)) {
    notFound();
  }

  const locale: Locale = lang;
  const dict = await getDictionary(locale);

  const news = await prisma.news.findMany({
    orderBy: { publishedAt: 'desc' },
    include: { translations: true },
  });

  const cards = news.map((item: (typeof news)[number]) => {
    const localized = getLocalizedNewsContent(item, locale, i18n.defaultLocale);

    return {
      id: item.id,
      slug: item.slug,
      title: localized.title,
      subtitle: dict.ui.newsList.cardSubtitle,
      imageUrl: normalizeImageUrl(item.imgUrl),
    };
  });

  return (
    <NewsListClient
      locale={locale}
      badge={dict.ui.newsList.badge}
      title={dict.ui.newsList.title}
      subtitle={dict.ui.newsList.subtitle}
      loadMoreLabel={dict.ui.newsList.loadMore}
      cards={cards}
    />
  );
}
