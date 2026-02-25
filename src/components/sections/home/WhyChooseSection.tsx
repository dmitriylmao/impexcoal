import Image from 'next/image';
import styles from './WhyChooseSection.module.css';

type WhyChooseCard = {
  title: string;
  subtitle: string;
  description: string;
};

type WhyChooseSectionProps = {
  badge: string;
  title: string;
  cards: WhyChooseCard[];
};

export default function WhyChooseSection({ badge, title, cards }: WhyChooseSectionProps) {
  return (
    <section id="next-block" className={styles.root} aria-label={title}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <span className={styles.badge}>{badge}</span>
          <h2 className={styles.title}>{title}</h2>
        </div>

        <div className={styles.grid}>
          {cards.slice(0, 4).map((card, index) => (
            <article key={`${card.title}-${index}`} className={styles.card}>
              <div className={styles.iconWrap}>
                <Image src="/globe.svg" alt="" width={86} height={86} className={styles.cardIcon} />
              </div>

              <h3 className={styles.cardTitle}>{card.title}</h3>
              <p className={styles.cardSubtitle}>{card.subtitle}</p>
              <p className={styles.cardDescription}>{card.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
