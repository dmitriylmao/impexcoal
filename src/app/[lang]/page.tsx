import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getDictionary } from '@/dictionaries/get-dictionary';
import LangSwitcher from '@/components/LangSwitcher';
import { i18n, isValidLocale, type Locale } from '@/i18n/config';

export function generateStaticParams() {
  return i18n.locales.map((lang) => ({ lang }));
}

function getLocalizedNewsContent(
  item: {
    title: string;
    content: string;
    translations: { locale: string; title: string; content: string }[];
  },
  locale: Locale,
) {
  const exact = item.translations.find((translation) => translation.locale === locale);
  if (exact) {
    return exact;
  }

  const russian = item.translations.find((translation) => translation.locale === i18n.defaultLocale);
  if (russian) {
    return russian;
  }

  return { title: item.title, content: item.content };
}

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;

  if (!isValidLocale(lang)) {
    notFound();
  }

  const locale: Locale = lang;
  const dict = await getDictionary(locale);

  const news = await prisma.news.findMany({
    orderBy: { publishedAt: 'desc' },
    include: { category: true, translations: true },
  });

  const dateLocale = locale === 'en' ? 'en-US' : locale === 'tr' ? 'tr-TR' : 'ru-RU';

  return (
    <div className="min-h-screen bg-zinc-50 p-8 font-sans dark:bg-black sm:p-20">
      <main className="mx-auto flex max-w-3xl flex-col gap-10">
        <header className="flex flex-col gap-4 border-b border-zinc-200 pb-8 dark:border-zinc-800">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold dark:text-white">{dict.header.title}</h1>
              <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">{dict.header.subtitle}</p>
            </div>
            <LangSwitcher />
          </div>
        </header>

        <section className="flex flex-col gap-8">
          <h2 className="text-2xl font-semibold dark:text-white">{dict.news.title}</h2>

          {news.length === 0 ? (
            <p className="text-zinc-500">{dict.news.empty}</p>
          ) : (
            news.map((item) => {
              const localized = getLocalizedNewsContent(item, locale);

              return (
                <article
                  key={item.id}
                  className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
                >
                  {item.imgUrl && (
                    <img
                      src={item.imgUrl}
                      alt={localized.title}
                      className="mb-6 h-64 w-full rounded-xl object-cover"
                    />
                  )}
                  <div className="mb-3 flex items-center gap-3">
                    <span className="rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300">
                      {item.category.name}
                    </span>
                    <time className="text-sm font-medium text-zinc-500 dark:text-zinc-500">
                      {new Date(item.publishedAt).toLocaleDateString(dateLocale)}
                    </time>
                  </div>
                  <h2 className="mb-3 text-2xl leading-snug font-bold dark:text-white">{localized.title}</h2>
                  <p className="whitespace-pre-wrap leading-relaxed text-zinc-600 dark:text-zinc-300">
                    {localized.content}
                  </p>
                </article>
              );
            })
          )}
        </section>
      </main>
    </div>
  );
}