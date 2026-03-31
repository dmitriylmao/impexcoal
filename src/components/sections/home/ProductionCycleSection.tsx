import Image from 'next/image';
import styles from './ProductionCycleSection.module.css';

type ProductionCycleSectionProps = {
  badge: string;
  title: string;
  imageAlt: string;
};

export default function ProductionCycleSection({ badge, title, imageAlt }: ProductionCycleSectionProps) {
  return (
    <section className={styles.root} aria-label={title}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <span className={styles.badge}>
            <Image src="/icons/arrows-clockwise.svg" alt="" width={14} height={14} className={styles.badgeIcon} aria-hidden />
            {badge}
          </span>
          <h2 className={styles.title}>{title}</h2>
        </div>

        <div className={styles.imageFrame}>
          <Image src="/images/cFinal3.png" alt={imageAlt} fill className={styles.image} sizes="(max-width: 800px) 100vw, 1200px" />
        </div>
      </div>
    </section>
  );
}

