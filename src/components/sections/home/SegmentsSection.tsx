'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import styles from './SegmentsSection.module.css';

type SegmentTab = {
  tab: string;
  title: string;
  description: string;
};

type SegmentsSectionProps = {
  badge: string;
  title: string;
  cta: string;
  tabs: SegmentTab[];
};

const images = ['/image.png', '/image1.jpg', '/image2.jpg'];

export default function SegmentsSection({ badge, title, cta, tabs }: SegmentsSectionProps) {
  const [active, setActive] = useState(0);
  const safeTabs = tabs.slice(0, 3);
  const activeTab = safeTabs[active] ?? safeTabs[0];

  const nextImage = useMemo(() => {
    if (safeTabs.length < 2) {
      return images[0];
    }

    const next = (active + 1) % safeTabs.length;
    return images[next] ?? images[0];
  }, [active, safeTabs.length]);

  return (
    <section className={styles.root} aria-label={title}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <span className={styles.badge}>
            <Image src="/icons/user-check.svg" alt="" width={14} height={14} className={styles.badgeIcon} aria-hidden />
            {badge}
          </span>
          <h2 className={styles.title}>{title}</h2>
        </div>

        <div className={styles.panel}>
          <div className={styles.tabs}>
            {safeTabs.map((item, index) => (
              <button
                key={item.tab}
                type="button"
                className={index === active ? `${styles.tabButton} ${styles.tabButtonActive}` : styles.tabButton}
                onClick={() => setActive(index)}
              >
                {item.tab}
              </button>
            ))}
          </div>

          <div className={styles.content}>
            <div className={styles.visual}>
              <div className={styles.mainImageWrap}>
                <Image
                  key={`main-${active}`}
                  src={images[active] ?? images[0]}
                  alt={activeTab?.title ?? ''}
                  fill
                  className={styles.mainImage}
                  sizes="(max-width: 800px) 90vw, 40vw"
                />
              </div>
              <div className={styles.overlayImageWrap}>
                <Image
                  key={`overlay-${active}`}
                  src={nextImage}
                  alt=""
                  fill
                  className={styles.overlayImage}
                  sizes="(max-width: 800px) 70vw, 26vw"
                />
              </div>
            </div>

            <div className={styles.text}>
              <h3 className={styles.itemTitle}>{activeTab?.title}</h3>
              <p className={styles.itemDescription}>{activeTab?.description}</p>
              <button type="button" className={styles.ctaButton}>
                <div className={styles.glow}></div>

                <div className={styles.borderWrapper}>
                  <div className={`${styles.stroke} ${styles.strokeDefault}`}></div>
                  <div className={`${styles.stroke} ${styles.strokeHover}`}></div>
                </div>

                <div className={styles.innerFill}></div>

                <span className={styles.ctaLabel}>{cta}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
