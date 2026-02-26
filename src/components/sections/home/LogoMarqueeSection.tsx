import Image from 'next/image';
import styles from './LogoMarqueeSection.module.css';

const items = Array.from({ length: 10 });

export default function LogoMarqueeSection() {
  return (
    <section className={styles.root} aria-label="Brand marquee">
      <div className={styles.viewport}>
        <div className={styles.rail}>
          <div className={styles.group}>
            {items.map((_, index) => (
              <div key={`a-${index}`} className={styles.logoItem}>
                <Image src="/logo.png" alt="" width={54} height={54} className={styles.logo} />
              </div>
            ))}
          </div>

          <div className={styles.group} aria-hidden>
            {items.map((_, index) => (
              <div key={`b-${index}`} className={styles.logoItem}>
                <Image src="/logo.png" alt="" width={54} height={54} className={styles.logo} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
