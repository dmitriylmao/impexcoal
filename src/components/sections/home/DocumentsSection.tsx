import Image from 'next/image';
import DocumentsCarousel from './DocumentsCarousel';
import styles from './DocumentsSection.module.css';

const slides = [
  { src: '/image.png', alt: 'Document scan 1' },
  { src: '/image1.jpg', alt: 'Document scan 2' },
  { src: '/image2.jpg', alt: 'Document scan 3' },
  { src: '/skan1.webp', alt: 'Document scan 4' },
  { src: '/skan2.webp', alt: 'Document scan 5' },
];

type DocumentsSectionProps = {
  badge: string;
};

export default function DocumentsSection({ badge }: DocumentsSectionProps) {
  return (
    <section className={styles.root} aria-label={badge}>
      <div className={styles.inner}>
        <span className={styles.badge}>
          <Image src="/icons/check.svg" alt="" width={14} height={14} className={styles.badgeIcon} aria-hidden />
          {badge}
        </span>

        <DocumentsCarousel slides={slides} />
      </div>
    </section>
  );
}
