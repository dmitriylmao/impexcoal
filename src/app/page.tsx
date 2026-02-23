import { prisma } from "@/lib/prisma";

export default async function Home() {
  const news = await prisma.news.findMany({
    orderBy: { publishedAt: 'desc' },
    include: { category: true } // Подтягиваем название категории
  });

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-8 sm:p-20 font-sans">
      <main className="max-w-3xl mx-auto flex flex-col gap-10">
        
        <header className="border-b border-zinc-200 dark:border-zinc-800 pb-8">
          <h1 className="text-4xl font-bold dark:text-white">Угольная компания IMPEX</h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 mt-2">Лэндинг и лента новостей</p>
        </header>

        <section className="flex flex-col gap-8">
          {news.length === 0 ? (
            <p className="text-zinc-500">Новостей пока нет. Зайдите в /admin и добавьте первую!</p>
          ) : (
            news.map((item) => (
              <article key={item.id} className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800">
                {item.imgUrl && (
                  <img 
                    src={item.imgUrl} 
                    alt={item.title} 
                    className="w-full h-64 object-cover rounded-xl mb-6"
                  />
                )}
                <div className="flex items-center gap-3 mb-3">
                  <span className="bg-zinc-100 text-zinc-800 text-xs font-semibold px-2.5 py-1 rounded-md dark:bg-zinc-800 dark:text-zinc-300 uppercase tracking-wide">
                    {item.category.name}
                  </span>
                  <time className="text-sm text-zinc-500 dark:text-zinc-500 font-medium">
                    {new Date(item.publishedAt).toLocaleDateString('ru-RU')}
                  </time>
                </div>
                <h2 className="text-2xl font-bold dark:text-white mb-3 leading-snug">{item.title}</h2>
                <p className="text-zinc-600 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed">
                  {item.content}
                </p>
              </article>
            ))
          )}
        </section>
        
      </main>
    </div>
  );
}