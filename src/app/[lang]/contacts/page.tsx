import { notFound } from 'next/navigation';
import FaqSection from '@/components/sections/home/FaqSection';
import ContactsCards from '@/components/contacts/ContactsCards';
import { getDictionary } from '@/dictionaries/get-dictionary';
import { isValidLocale, type Locale } from '@/i18n/config';
import styles from './page.module.css';

export default async function ContactsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;

  if (!isValidLocale(lang)) {
    notFound();
  }

  const locale: Locale = lang;
  const dict = await getDictionary(locale);
  const c = dict.ui.contactsPage;

  return (
    <div className={styles.page}>
      <ContactsCards c={c} />

      <FaqSection
        badge={dict.ui.homeFaq.badge}
        title={dict.ui.homeFaq.title}
        items={dict.ui.homeFaq.items}
        cardTitle={dict.ui.homeFaq.cardTitle}
        cardSubtitle={dict.ui.homeFaq.cardSubtitle}
        cardButton={dict.ui.homeFaq.cardButton}
      />
    </div>
  );
}
