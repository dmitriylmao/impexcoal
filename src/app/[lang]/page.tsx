import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getDictionary } from '@/dictionaries/get-dictionary';
import { i18n, isValidLocale, type Locale } from '@/i18n/config';

export function generateStaticParams() {
  return i18n.locales.map((lang) => ({ lang }));
}

function getLocalizedNewsContent(
  item: {
    title: string;
    content: string;
    translations: { locale: string; title: string; content: string }[];
  },
  locale: Locale,
) {
  const exact = item.translations.find((translation) => translation.locale === locale);
  if (exact) {
    return exact;
  }

  const russian = item.translations.find((translation) => translation.locale === i18n.defaultLocale);
  if (russian) {
    return russian;
  }

  return { title: item.title, content: item.content };
}

function normalizeImageUrl(value: string | null): string | null {
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

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;

  if (!isValidLocale(lang)) {
    notFound();
  }

  const locale: Locale = lang;
  const dict = await getDictionary(locale);

  const news = await prisma.news.findMany({
    orderBy: { publishedAt: 'desc' },
    include: { category: true, translations: true },
  });

  const dateLocale = locale === 'en' ? 'en-US' : locale === 'tr' ? 'tr-TR' : 'ru-RU';

  return (
    <div className="landing-news">
      <section className="landing-news-headline">
        <h1 className="landing-news-title">{dict.header.title}</h1>
        <p className="landing-news-subtitle">{dict.header.subtitle}</p>
      </section>

      <section className="news-grid">
        <h2 className="landing-news-subtitle">{dict.news.title}</h2>

        {news.length === 0 ? (
          <p className="news-content">{dict.news.empty}</p>
        ) : (
          news.map((item) => {
            const localized = getLocalizedNewsContent(item, locale);
            const imageUrl = normalizeImageUrl(item.imgUrl);

            return (
              <article key={item.id} className="news-card">
                {imageUrl ? <img src={imageUrl} alt={localized.title} className="news-image" loading="lazy" /> : null}

                <div className="news-meta">
                  <span className="news-badge">{item.category.name}</span>
                  <time className="news-date">{new Date(item.publishedAt).toLocaleDateString(dateLocale)}</time>
                </div>

                <h3 className="news-title">{localized.title}</h3>
                <p className="news-content">{localized.content}</p>
              </article>
            );
          })
        )}
      </section>
    </div>
  );
}