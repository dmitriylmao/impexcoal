import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requireAdminAuthOrRedirect } from '@/lib/admin-auth';
import { i18n } from '@/i18n/config';
import NewsEditorForm from '@/components/admin/NewsEditorForm';
import {
  createCategoryAction,
  createNewsAction,
  createProjectAction,
  deleteNewsAction,
  logoutAdminAction,
} from '@/app/admin/actions';

export default async function AdminPage() {
  await requireAdminAuthOrRedirect();

  const [projects, categories, news] = await Promise.all([
    prisma.project.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: {
            categories: true,
            news: true,
          },
        },
      },
    }),
    prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: {
        project: true,
        _count: {
          select: {
            news: true,
          },
        },
      },
    }),
    prisma.news.findMany({
      orderBy: { publishedAt: 'desc' },
      include: { project: true, category: true, translations: true },
    }),
  ]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 p-6 font-sans md:p-10">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Админ-панель IMPEX Coal</h1>
        <form action={logoutAdminAction}>
          <button
            type="submit"
            className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
          >
            Выйти
          </button>
        </form>
      </div>

      <section className="grid gap-4 rounded-2xl border border-zinc-200 p-5">
        <h2 className="text-xl font-semibold">1. Проекты</h2>
        <form action={createProjectAction} className="grid gap-3 md:grid-cols-3">
          <input name="name" placeholder="Название проекта" required className="rounded-md border p-3" />
          <input name="slug" placeholder="slug (например, coal)" required className="rounded-md border p-3" />
          <button className="rounded-md bg-zinc-900 px-4 py-3 font-medium text-white" type="submit">
            Добавить проект
          </button>
        </form>
        <div className="overflow-x-auto rounded-md border border-zinc-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50">
              <tr>
                <th className="p-3">Проект</th>
                <th className="p-3">Slug</th>
                <th className="p-3">Категории</th>
                <th className="p-3">Новости</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id} className="border-t">
                  <td className="p-3">{project.name}</td>
                  <td className="p-3">{project.slug}</td>
                  <td className="p-3">{project._count.categories}</td>
                  <td className="p-3">{project._count.news}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-4 rounded-2xl border border-zinc-200 p-5">
        <h2 className="text-xl font-semibold">2. Категории</h2>
        <form action={createCategoryAction} className="grid gap-3 md:grid-cols-3">
          <input name="name" placeholder="Название категории" required className="rounded-md border p-3" />
          <select name="projectId" defaultValue="" required className="rounded-md border p-3">
            <option value="" disabled>
              Выберите проект
            </option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
          <button
            className="rounded-md bg-zinc-900 px-4 py-3 font-medium text-white disabled:cursor-not-allowed disabled:bg-zinc-400"
            type="submit"
            disabled={projects.length === 0}
          >
            Добавить категорию
          </button>
        </form>
      </section>

      <section className="grid gap-4 rounded-2xl border border-zinc-200 p-5">
        <h2 className="text-xl font-semibold">3. Новости (создание + предпросмотр)</h2>
        <NewsEditorForm
          action={createNewsAction}
          submitLabel="Опубликовать новость"
          projects={projects.map((p) => ({ id: p.id, name: p.name }))}
          categories={categories.map((c) => ({ id: c.id, name: c.name }))}
          locales={i18n.locales}
        />

        <div className="overflow-x-auto rounded-md border border-zinc-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50">
              <tr>
                <th className="p-3">Заголовок (RU base)</th>
                <th className="p-3">Проект</th>
                <th className="p-3">Категория</th>
                <th className="p-3">Переводы</th>
                <th className="p-3">Дата</th>
                <th className="p-3">Действия</th>
              </tr>
            </thead>
            <tbody>
              {news.map((item) => {
                const translatedLocales = new Set(item.translations.map((translation) => translation.locale));

                return (
                  <tr key={item.id} className="border-t">
                    <td className="p-3">{item.title}</td>
                    <td className="p-3">{item.project.name}</td>
                    <td className="p-3">{item.category.name}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        {i18n.locales.map((locale) => (
                          <span
                            key={locale}
                            className={`rounded px-2 py-1 text-xs font-semibold ${
                              translatedLocales.has(locale)
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-zinc-200 text-zinc-600'
                            }`}
                          >
                            {locale.toUpperCase()}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3">{new Date(item.publishedAt).toLocaleDateString('ru-RU')}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <Link href={`/admin/news/${item.id}`} className="text-blue-700 hover:underline">
                          Редактировать
                        </Link>
                        <form action={deleteNewsAction}>
                          <input type="hidden" name="id" value={item.id} />
                          <button type="submit" className="text-red-600 hover:underline">
                            Удалить
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {news.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-3 text-zinc-500">
                    Новостей пока нет.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}