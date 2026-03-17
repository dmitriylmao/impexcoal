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
  const cardImages = ['/images/whyChoose/3.png', '/images/whyChoose/4.png', '/images/whyChoose/5.png', '/images/whyChoose/6.png'];

  return (
    <section id="next-block" className={styles.root} aria-label={title}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <span className={styles.badge}>
            <Image src="/icons/sparkle.svg" alt="" width={14} height={14} className={styles.badgeIcon} aria-hidden />
            {badge}
          </span>
          <h2 className={styles.title}>{title}</h2>
        </div>

        <div className={styles.grid}>
          {cards.slice(0, 4).map((card, index) => (
            <article key={`${card.title}-${index}`} className={styles.card}>
              <div className={styles.iconWrap}>
                <Image
                  src={cardImages[index] ?? '/images/ch1.png'}
                  alt={card.title}
                  width={400}
                  height={400}
                  className={styles.cardIcon}
                />
              </div>
              <div className={styles.cardText}>
                <h3 className={styles.cardTitle}>{card.title}</h3>
                <p className={styles.cardDescription}>
                  {card.subtitle ? `${card.subtitle} ${card.description}` : card.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
