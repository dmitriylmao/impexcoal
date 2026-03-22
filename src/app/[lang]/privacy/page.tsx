import { notFound } from 'next/navigation';
import { getDictionary } from '@/dictionaries/get-dictionary';
import { isValidLocale, type Locale } from '@/i18n/config';
import styles from './page.module.css';

export default async function PrivacyPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;

  if (!isValidLocale(lang)) {
    notFound();
  }

  const locale = lang as Locale;
  const dict = await getDictionary(locale);
  const content = dict.ui.privacyPage.content
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <section className={styles.root}>
      <div className={styles.rays} aria-hidden="true" />
      <div className={styles.particles} aria-hidden="true" />

      <article className={styles.wrapper}>
        <h1 className={styles.title}>{dict.ui.privacyPage.title}</h1>
        <div className={styles.content}>
          {content.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </article>
    </section>
  );
}
