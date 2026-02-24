import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getDictionary } from '@/dictionaries/get-dictionary';
import { i18n, isValidLocale, type Locale } from '@/i18n/config';
import { getLocalizedNewsContent, normalizeImageUrl } from '@/lib/news-localization';
import styles from './page.module.css';

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;

  if (!isValidLocale(lang)) {
    notFound();
  }

  const locale: Locale = lang;
  const dict = await getDictionary(locale);

  const news = await prisma.news.findUnique({
    where: { slug },
    include: { translations: true },
  });

  if (!news) {
    notFound();
  }

  const localized = getLocalizedNewsContent(news, locale, i18n.defaultLocale);
  const imageUrl = normalizeImageUrl(news.imgUrl);

  const paragraphs = localized.content
    .split(/\n\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <article className={styles.wrapper}>
      <Link href={`/${locale}/news`} className={styles.backButton}>
        {dict.ui.newsArticle.back} <span>←</span>
      </Link>

      <p className={styles.subtitle}>{dict.ui.newsArticle.subtitle}</p>
      <h1 className={styles.title}>{localized.title}</h1>
      <p className={styles.subtitle}>{dict.ui.newsList.cardSubtitle}</p>

      {imageUrl ? <img src={imageUrl} alt={localized.title} className={styles.image} /> : null}

      <div className={styles.content}>
        {paragraphs.length > 0
          ? paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)
          : [<p key="fallback">{localized.content}</p>]}
      </div>
    </article>
  );
}