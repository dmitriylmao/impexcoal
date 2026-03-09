import Image from 'next/image';
import { notFound } from 'next/navigation';
import FaqSection from '@/components/sections/home/FaqSection';
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
      <section className={styles.topSection} aria-label={dict.ui.header.nav.contacts}>
        <div className={styles.contactsGrid}>
          <div className={styles.leftColumn}>
            <article className={styles.infoCard}>
              <div className={styles.cardHead}>
                <span className={styles.cardIconWrap}>
                  <Image src="/icons/envelope-open.svg" alt="" width={32} height={32} className={styles.icon} />
                </span>
                <h2 className={styles.cardTitle}>{c.emailTitle}</h2>
              </div>
              <p className={styles.cardText}>{c.emailSubtitle}</p>
              <button type="button" className={styles.linkButton}>
                {c.emailLink}
              </button>
            </article>

            <article className={styles.infoCard}>
              <div className={styles.cardHead}>
                <span className={styles.cardIconWrap}>
                  <Image src="/icons/user-sound.svg" alt="" width={32} height={32} className={styles.icon} />
                </span>
                <h2 className={styles.cardTitle}>{c.managerTitle}</h2>
              </div>
              <p className={styles.cardText}>{c.managerSubtitle}</p>
              <button type="button" className={styles.linkButton}>
                {c.managerLink}
              </button>
            </article>
          </div>

          <article className={styles.infoCard}>
            <div className={styles.cardHead}>
              <span className={styles.cardIconWrap}>
                <Image src="/icons/map-pin-area.svg" alt="" width={32} height={32} className={styles.icon} />
              </span>
              <h2 className={styles.cardTitle}>{c.addressTitle}</h2>
            </div>
            <p className={styles.cardText}>{c.addressText}</p>
            <button type="button" className={styles.linkButton}>
              {c.mapLink}
            </button>
          </article>

          <article className={styles.formCard}>
            <div className={styles.cardHead}>
              <span className={styles.cardIconWrap}>
                <Image src="/icons/headset.svg" alt="" width={32} height={32} className={styles.icon} />
              </span>
              <h2 className={styles.cardTitle}>{c.feedbackTitle}</h2>
            </div>

            <form className={styles.form} action="#">
              <label className={styles.label}>
                {c.fullNameLabel}
                <input className={styles.input} type="text" placeholder={c.fullNamePlaceholder} />
              </label>

              <label className={styles.label}>
                {c.emailLabel}
                <input className={styles.input} type="email" placeholder={c.emailPlaceholder} />
              </label>

              <label className={styles.label}>
                {c.commentLabel}
                <textarea className={styles.textarea} rows={4} placeholder={c.commentPlaceholder} />
              </label>

              <button type="button" className={styles.submitButton}>
                {c.submit}
              </button>
            </form>
          </article>
        </div>
      </section>

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
