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
              <a href={`mailto:${c.emailLink}`} className={styles.linkButton}>
                {c.emailLink}
              </a>
            </article>

            <article className={styles.infoCard}>
              <div className={styles.cardHead}>
                <span className={styles.cardIconWrap}>
                  <Image src="/icons/user-sound.svg" alt="" width={32} height={32} className={styles.icon} />
                </span>
                <h2 className={styles.cardTitle}>{c.managerTitle}</h2>
              </div>
              <p className={styles.cardText}>{c.managerSubtitle}</p>
              <a
                href="https://web.telegram.org/k/#@wwwwwwwwwwwwwwwwwwvwwwwwwwwwww"
                className={styles.linkButton}
                target="_blank"
                rel="noreferrer"
              >
                {c.managerLink}
              </a>
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
            <a
              href="https://yandex.com/maps/39/rostov-na-donu/house/prospekt_korolyova_5_3/Z0AYcA5lT0UHQFptfX54dHVmYQ==/?ll=39.696980%2C47.295832&z=19.2"
              className={styles.linkButton}
              target="_blank"
              rel="noreferrer"
            >
              {c.mapLink}
            </a>
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
                <div className={styles.glow}></div>
                <div className={styles.borderWrapper}>
                  <div className={`${styles.stroke} ${styles.strokeDefault}`}></div>
                  <div className={`${styles.stroke} ${styles.strokeHover}`}></div>
                </div>
                <div className={styles.innerFill}></div>
                <span className={styles.submitLabel}>{c.submit}</span>
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
