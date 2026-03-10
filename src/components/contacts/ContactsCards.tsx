'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import styles from '@/app/[lang]/contacts/page.module.css';

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
};

function useIsMobile(maxWidth = 800) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${maxWidth}px)`);
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, [maxWidth]);

  return isMobile;
}

export default function ContactsCards({ c }: { c: ContactsContent }) {
  const reduceMotion = useReducedMotion();
  const isMobile = useIsMobile();

  const delayMap = useMemo(() => {
    if (isMobile) {
      return { email: 0, manager: 1, address: 2, feedback: 3 } as const;
    }
    return { manager: 0, email: 1, address: 2, feedback: 3 } as const;
  }, [isMobile]);

  const cardVariants = {
    hidden: { opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 18 },
    show: (orderIndex: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: reduceMotion ? 0.01 : 0.45,
        delay: reduceMotion ? 0 : orderIndex * 0.05,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    }),
  };

  return (
    <section className={styles.topSection}>
      <div className={styles.contactsGrid}>
        <div className={styles.leftColumn}>
          <motion.article
            className={styles.infoCard}
            custom={delayMap.email}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={cardVariants}
          >
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
          </motion.article>

          <motion.article
            className={styles.infoCard}
            custom={delayMap.manager}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={cardVariants}
          >
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
          </motion.article>
        </div>

        <motion.article
          className={styles.infoCard}
          custom={delayMap.address}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={cardVariants}
        >
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
        </motion.article>

        <motion.article
          className={styles.formCard}
          custom={delayMap.feedback}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={cardVariants}
        >
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
        </motion.article>
      </div>
    </section>
  );
}
