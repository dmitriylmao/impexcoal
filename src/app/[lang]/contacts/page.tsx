import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import FaqSection from '@/components/sections/home/FaqSection';
import ContactsCards from '@/components/contacts/ContactsCards';
import { getDictionary } from '@/dictionaries/get-dictionary';
import { isValidLocale, type Locale } from '@/i18n/config';
import { getSectionTitle } from '@/lib/seo';
import styles from './page.module.css';

type ContactsPageProps = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ status?: string }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;

  if (!isValidLocale(lang)) {
    return {};
  }

  return {
    title: getSectionTitle(lang, 'contacts'),
  };
}

export default async function ContactsPage({ params, searchParams }: ContactsPageProps) {
  const { lang } = await params;
  const query = await searchParams;

  if (!isValidLocale(lang)) {
    notFound();
  }

  const locale: Locale = lang;
  const dict = await getDictionary(locale);
  const c = dict.ui.contactsPage;
  const t = dict.ui.thanksPage;
  const isThanks = query.status === 'thanks';

  return (
    <div className={styles.page}>
      {isThanks ? (
        <section className={styles.thanksSection}>
          <div className={styles.thanksCard}>
            <h1 className={styles.thanksTitle}>{t.title}</h1>
            <p className={styles.thanksSubtitle}>{t.subtitle}</p>
            <Link href={`/${locale}`} className={styles.thanksHomeButton}>
              <div className={styles.glow}></div>
              <div className={styles.borderWrapper}>
                <div className={`${styles.stroke} ${styles.strokeDefault}`}></div>
                <div className={`${styles.stroke} ${styles.strokeHover}`}></div>
              </div>
              <div className={styles.innerFill}></div>
              <span className={styles.thanksHomeLabel}>{t.homeButton}</span>
            </Link>
          </div>
        </section>
      ) : (
        <ContactsCards c={c} locale={locale} />
      )}

      {!isThanks ? (
        <FaqSection
          badge={dict.ui.homeFaq.badge}
          title={dict.ui.homeFaq.title}
          items={dict.ui.homeFaq.items}
          cardTitle={dict.ui.homeFaq.cardTitle}
          cardSubtitle={dict.ui.homeFaq.cardSubtitle}
          cardButton={dict.ui.homeFaq.cardButton}
        />
      ) : null}
    </div>
  );
}
