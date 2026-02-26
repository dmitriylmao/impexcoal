import Image from 'next/image';
import styles from './LogoMarqueeSection.module.css';

// Давай сделаем 8 штук, если они крупные, этого хватит для заполнения
const items = Array.from({ length: 8 });

export default function LogoMarqueeSection() {
  return (
    <section className={styles.root}>
      <div className={styles.viewport}>
        <div className={styles.rail}>
          {/* Первая группа */}
          <div className={styles.group}>
            {items.map((_, index) => (
              <div key={`a-${index}`} className={styles.logoItem}>
                <Image 
                  src="/logo.png" 
                  alt="Partner Logo" 
                  width={160}  // Подняли разрешение
                  height={80} 
                  className={styles.logo} 
                />
              </div>
            ))}
          </div>

          {/* Вторая группа (для бесконечного цикла) */}
          <div className={styles.group} aria-hidden>
            {items.map((_, index) => (
              <div key={`b-${index}`} className={styles.logoItem}>
                <Image 
                  src="/logo.png" 
                  alt="" 
                  width={160} 
                  height={80} 
                  className={styles.logo} 
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}