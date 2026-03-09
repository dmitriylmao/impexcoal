import Image from 'next/image';
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
  const publishedAt = new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(news.publishedAt);

  const normalizedContent = localized.content.replace(/\r\n/g, '\n').trim();
  const paragraphsByDoubleBreak = normalizedContent
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  const paragraphs =
    paragraphsByDoubleBreak.length > 1
      ? paragraphsByDoubleBreak
      : normalizedContent
          .split(/\n+/)
          .map((paragraph) => paragraph.trim())
          .filter(Boolean);

  return (
    <article className={styles.wrapper}>
      <Link href={`/${locale}/news`} className={styles.backButton}>
        <div className={styles.glow}></div>
        <div className={styles.borderWrapper}>
          <div className={`${styles.stroke} ${styles.strokeDefault}`}></div>
          <div className={`${styles.stroke} ${styles.strokeHover}`}></div>
        </div>
        <div className={styles.innerFill}></div>
        <span className={styles.backButtonContent}>
          <Image src="/icons/arrow-left.svg" alt="" width={16} height={16} className={styles.backIcon} aria-hidden />
          <span className={styles.backLabel}>{dict.ui.newsArticle.back}</span>
        </span>
      </Link>

      <h1 className={styles.title}>{localized.title}</h1>

      {imageUrl ? <img src={imageUrl} alt={localized.title} className={styles.image} /> : null}

      <div className={styles.content}>
        {paragraphs.length > 0
          ? paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)
          : [<p key="fallback">{localized.content}</p>]}
      </div>

      <p className={styles.publishDate}>{publishedAt}</p>
    </article>
  );
}
