import styles from './DifferencesSection.module.css';
import Image from 'next/image';

type DifferencesSectionProps = {
  badge: string;
  title: string;
  leadAccent: string;
  leadRest: string;
  body: string;
};

export default function DifferencesSection({ badge, title, leadAccent, leadRest, body }: DifferencesSectionProps) {
  return (
    <section className={styles.root} aria-label={title}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <span className={styles.badge}>
            <Image src="/icons/seal-check.svg" alt="" width={14} height={14} className={styles.badgeIcon} aria-hidden />
            {badge}
          </span>
          <h2 className={styles.title}>{title}</h2>
        </div>

        <div className={styles.frame}>
          <div className={styles.bgShape} />
          <div className={styles.textWrap}>
            <p className={styles.lead}>
              <span className={styles.leadAccent}>{leadAccent}</span>
              <span className={styles.leadRest}> {leadRest}</span>
            </p>
            <p className={styles.body}>{body}</p>
          </div>
          <div className={styles.imageWrap}>
            <Image src="/image1.jpg" alt="" fill className={styles.image} sizes="(max-width: 800px) 100vw, 50vw" />
          </div>
        </div>
      </div>
    </section>
  );
}
