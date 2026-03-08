import { notFound } from 'next/navigation';
import HeroSection from '@/components/sections/home/HeroSection';
import WhyChooseSection from '@/components/sections/home/WhyChooseSection';
import DifferencesSection from '@/components/sections/home/DifferencesSection';
import DeckSection from '@/components/sections/home/DeckSection';
import SegmentsSection from '@/components/sections/home/SegmentsSection';
import LogoMarqueeSection from '@/components/sections/home/LogoMarqueeSection';
import ProductionCycleSection from '@/components/sections/home/ProductionCycleSection';
import ProductsCatalogSection from '@/components/sections/home/ProductsCatalogSection';
import FaqSection from '@/components/sections/home/FaqSection';
import ContactSection from '@/components/sections/home/ContactSection';
import { getDictionary } from '@/dictionaries/get-dictionary';
import { i18n, isValidLocale, type Locale } from '@/i18n/config';
import { prisma } from '@/lib/prisma';
import { getLocalizedProductContent } from '@/lib/product-localization';
import { normalizeImageUrl } from '@/lib/news-localization';
import styles from './page.module.css';

export function generateStaticParams() {
  return i18n.locales.map((lang) => ({ lang }));
}

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;

  if (!isValidLocale(lang)) {
    notFound();
  }

  const dict = await getDictionary(lang as Locale);
  const locale = lang as Locale;

  const products = await prisma.product.findMany({
    orderBy: { slug: 'asc' },
    include: { translations: true },
  });

  const productCards = products.map((item: (typeof products)[number]) => {
    const localized = getLocalizedProductContent(item, locale, i18n.defaultLocale);

    return {
      slug: item.slug,
      name: localized.name,
      description: localized.description,
      imageUrl: normalizeImageUrl(item.imgUrl) ?? '/image.png',
    };
  });

  return (
    <div id="top" className={styles.page}>
      <HeroSection
        title={dict.ui.homeHero.title}
        subtitle={dict.ui.homeHero.subtitle}
        cta={dict.ui.homeHero.cta}
        scrollLabel={dict.ui.homeHero.scrollLabel}
      /> 

     <div id="next-block">
        <WhyChooseSection
          badge={dict.ui.homeWhyChoose.badge}
          title={dict.ui.homeWhyChoose.title}
          cards={dict.ui.homeWhyChoose.cards}
        />
      </div> 

      <div id="about" className={styles.anchorSection}>
        <DifferencesSection
          badge={dict.ui.homeDifferences.badge}
          title={dict.ui.homeDifferences.title}
          leadAccent={dict.ui.homeDifferences.leadAccent}
          leadRest={dict.ui.homeDifferences.leadRest}
          body={dict.ui.homeDifferences.body}
        />
      </div> 

      <DeckSection badge={dict.ui.homeDeck.badge} cards={dict.ui.homeDeck.cards} /> 

      <div id="segments" className={styles.anchorSection}>
        <SegmentsSection
          badge={dict.ui.homeSegments.badge}
          title={dict.ui.homeSegments.title}
          cta={dict.ui.homeSegments.cta}
          tabs={dict.ui.homeSegments.tabs}
        />
      </div> 

      <LogoMarqueeSection />

      <ProductionCycleSection
        badge={dict.ui.homeCycle.badge}
        title={dict.ui.homeCycle.title}
        imageAlt={dict.ui.homeCycle.imageAlt}
      />

      <div id="products" className={styles.anchorSection}>
        <ProductsCatalogSection
          badge={dict.ui.homeProducts.badge}
          title={dict.ui.homeProducts.title}
          subtitle={dict.ui.homeProducts.subtitle}
          showAllLabel={dict.ui.homeProducts.showAll}
          showLessLabel={dict.ui.homeProducts.showLess}
          modalCloseLabel={dict.ui.homeProducts.modalClose}
          cards={productCards}
        />
      </div>

      <FaqSection
        badge={dict.ui.homeFaq.badge}
        title={dict.ui.homeFaq.title}
        items={dict.ui.homeFaq.items}
        cardTitle={dict.ui.homeFaq.cardTitle}
        cardSubtitle={dict.ui.homeFaq.cardSubtitle}
        cardButton={dict.ui.homeFaq.cardButton}
      />

      <ContactSection
        badge={dict.ui.homeContact.badge}
        title={dict.ui.homeContact.title}
        cta={dict.ui.homeContact.cta}
      />
    </div>
  );
}
