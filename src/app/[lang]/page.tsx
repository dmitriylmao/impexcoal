import { notFound } from 'next/navigation';
import HeroSection from '@/components/sections/home/HeroSection';
import WhyChooseSection from '@/components/sections/home/WhyChooseSection';
import DifferencesSection from '@/components/sections/home/DifferencesSection';
import DeckSection from '@/components/sections/home/DeckSection';
import { getDictionary } from '@/dictionaries/get-dictionary';
import { i18n, isValidLocale, type Locale } from '@/i18n/config';
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

  return (
    <div className={styles.page}>
      <HeroSection
        title={dict.ui.homeHero.title}
        subtitle={dict.ui.homeHero.subtitle}
        cta={dict.ui.homeHero.cta}
        scrollLabel={dict.ui.homeHero.scrollLabel}
      />

      <WhyChooseSection
        badge={dict.ui.homeWhyChoose.badge}
        title={dict.ui.homeWhyChoose.title}
        cards={dict.ui.homeWhyChoose.cards}
      />

      <DifferencesSection
        badge={dict.ui.homeDifferences.badge}
        title={dict.ui.homeDifferences.title}
        leadAccent={dict.ui.homeDifferences.leadAccent}
        leadRest={dict.ui.homeDifferences.leadRest}
        body={dict.ui.homeDifferences.body}
      />

      <DeckSection badge={dict.ui.homeDeck.badge} cards={dict.ui.homeDeck.cards} />
    </div>
  );
}
