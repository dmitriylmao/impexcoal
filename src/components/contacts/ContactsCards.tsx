import Image from 'next/image';
import styles from '@/app/[lang]/contacts/page.module.css';
import FeedbackForm from '@/components/contacts/FeedbackForm';

type ContactsContent = {
  emailTitle: string;
  emailSubtitle: string;
  emailLink: string;
  managerTitle: string;
  managerSubtitle: string;
  managerLink: string;
  addressTitle: string;
  addressText: string;
  mapLink: string;
  feedbackTitle: string;
  fullNameLabel: string;
  fullNamePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  commentLabel: string;
  commentPlaceholder: string;
  submit: string;
  submitSending: string;
  errorRequired: string;
  errorServiceUnavailable: string;
  errorSendFailed: string;
  errorNetwork: string;
};

export default function ContactsCards({ c, locale }: { c: ContactsContent; locale: string }) {
  return (
    <section className={styles.topSection}>
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

          <FeedbackForm
            locale={locale}
            fullNameLabel={c.fullNameLabel}
            fullNamePlaceholder={c.fullNamePlaceholder}
            emailLabel={c.emailLabel}
            emailPlaceholder={c.emailPlaceholder}
            commentLabel={c.commentLabel}
            commentPlaceholder={c.commentPlaceholder}
            submit={c.submit}
            submitSending={c.submitSending}
            errorRequired={c.errorRequired}
            errorServiceUnavailable={c.errorServiceUnavailable}
            errorSendFailed={c.errorSendFailed}
            errorNetwork={c.errorNetwork}
          />
        </article>
      </div>
    </section>
  );
}
