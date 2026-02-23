import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { requireAdminAuthOrRedirect } from '@/lib/admin-auth';
import { i18n, type Locale } from '@/i18n/config';
import NewsEditorForm from '@/components/admin/NewsEditorForm';
import { updateNewsAction } from '@/app/admin/actions';

export default async function EditNewsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminAuthOrRedirect();

  const { id } = await params;

  const [news, projects, categories] = await Promise.all([
    prisma.news.findUnique({
      where: { id },
      include: { translations: true },
    }),
    prisma.project.findMany({ orderBy: { name: 'asc' } }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
  ]);

  if (!news) {
    notFound();
  }

  const translations = news.translations.reduce<
    Partial<Record<Locale, { title: string; content: string }>>
  >((acc, item) => {
    if (i18n.locales.includes(item.locale as Locale)) {
      acc[item.locale as Locale] = { title: item.title, content: item.content };
    }

    return acc;
  }, {});

  if (!translations.ru) {
    translations.ru = { title: news.title, content: news.content };
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-6 md:p-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Редактирование новости</h1>
        <Link href="/admin" className="rounded-md border border-zinc-300 px-4 py-2 text-sm hover:bg-zinc-100">
          Назад в админку
        </Link>
      </div>

      <section className="rounded-2xl border border-zinc-200 p-5">
        <NewsEditorForm
          action={updateNewsAction}
          submitLabel="Сохранить изменения"
          projects={projects.map((p) => ({ id: p.id, name: p.name }))}
          categories={categories.map((c) => ({ id: c.id, name: c.name }))}
          locales={i18n.locales}
          initial={{
            id: news.id,
            slug: news.slug,
            imgUrl: news.imgUrl,
            projectId: news.projectId,
            categoryId: news.categoryId,
            translations,
          }}
        />
      </section>
    </div>
  );
}