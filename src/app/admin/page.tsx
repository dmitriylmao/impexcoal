import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requireAdminAuthOrRedirect } from '@/lib/admin-auth';
import { i18n } from '@/i18n/config';
import NewsEditorForm from '@/components/admin/NewsEditorForm';
import ProductEditorForm from '@/components/admin/ProductEditorForm';
import {
  createNewsAction,
  createProductAction,
  createProjectAction,
  deleteNewsAction,
  deleteProductAction,
  logoutAdminAction,
} from '@/app/admin/actions';

type AdminSearchParams = {
  qNews?: string;
  qProducts?: string;
  projectId?: string;
  missing?: string;
};

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<AdminSearchParams>;
}) {
  await requireAdminAuthOrRedirect();

  const params = await searchParams;
  const qNews = String(params.qNews ?? '').trim();
  const qProducts = String(params.qProducts ?? '').trim();
  const projectId = String(params.projectId ?? '').trim();
  const missingOnly = params.missing === '1';

  const [projects, news, products] = await Promise.all([
    prisma.project.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { news: true, products: true } } },
    }),
    prisma.news.findMany({
      where: {
        ...(projectId ? { projectId } : {}),
        ...(qNews
          ? {
              OR: [
                { title: { contains: qNews, mode: 'insensitive' } },
                { slug: { contains: qNews, mode: 'insensitive' } },
                {
                  translations: {
                    some: { title: { contains: qNews, mode: 'insensitive' } },
                  },
                },
              ],
            }
          : {}),
      },
      orderBy: { publishedAt: 'desc' },
      include: { project: true, translations: true },
    }),
    prisma.product.findMany({
      where: {
        ...(projectId ? { projectId } : {}),
        ...(qProducts
          ? {
              OR: [
                { slug: { contains: qProducts, mode: 'insensitive' } },
                {
                  translations: {
                    some: { name: { contains: qProducts, mode: 'insensitive' } },
                  },
                },
              ],
            }
          : {}),
      },
      orderBy: { id: 'desc' },
      include: { project: true, translations: true },
    }),
  ]);

  const hasMissingTranslations = (locales: readonly string[], translated: Set<string>) =>
    locales.some((locale) => !translated.has(locale));

  const visibleNews = missingOnly
    ? news.filter((item) =>
        hasMissingTranslations(i18n.locales, new Set(item.translations.map((translation) => translation.locale))),
      )
    : news;

  const visibleProducts = missingOnly
    ? products.filter((item) =>
        hasMissingTranslations(i18n.locales, new Set(item.translations.map((translation) => translation.locale))),
      )
    : products;

  return (
    <div className="min-h-screen bg-[#020914]">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-4 py-6 md:px-8 md:py-8">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[linear-gradient(160deg,rgba(9,19,35,0.9),rgba(4,10,22,0.88))] p-5 shadow-[0_20px_40px_rgba(0,0,0,0.35)]">
          <div>
            <h1 className="text-2xl font-bold text-[#dbe3ef] md:text-3xl">Админ-панель IMPEX Coal</h1>
            <p className="mt-1 text-sm text-[#92a0b5]">Управление проектами, новостями и товарами</p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/ru#top"
              className="rounded-md border border-white/15 bg-[#0b1629] px-4 py-2 text-sm font-medium text-[#c7d2e4] transition hover:border-white/30 hover:text-white"
            >
              Главная
            </Link>
            <form action={logoutAdminAction}>
              <button
                type="submit"
                className="rounded-md border border-white/15 bg-[#0b1629] px-4 py-2 text-sm font-medium text-[#c7d2e4] transition hover:border-[#ff6a00]/55 hover:text-white"
              >
                Выйти
              </button>
            </form>
          </div>
        </div>

        <div className="grid gap-3 rounded-2xl border border-white/10 bg-[linear-gradient(165deg,rgba(9,19,35,0.88),rgba(4,10,22,0.85))] p-5 md:grid-cols-4">
          <div className="rounded-xl border border-white/10 bg-[#091427]/75 p-4">
            <p className="text-xs uppercase tracking-wide text-[#8e9cb3]">Проекты</p>
            <p className="mt-2 text-3xl font-semibold text-[#e3e9f4]">{projects.length}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-[#091427]/75 p-4">
            <p className="text-xs uppercase tracking-wide text-[#8e9cb3]">Новости</p>
            <p className="mt-2 text-3xl font-semibold text-[#e3e9f4]">{visibleNews.length}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-[#091427]/75 p-4">
            <p className="text-xs uppercase tracking-wide text-[#8e9cb3]">Товары</p>
            <p className="mt-2 text-3xl font-semibold text-[#e3e9f4]">{visibleProducts.length}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-[#091427]/75 p-4">
            <p className="text-xs uppercase tracking-wide text-[#8e9cb3]">Языки</p>
            <p className="mt-2 text-xl font-semibold text-[#e3e9f4]">{i18n.locales.join(' / ').toUpperCase()}</p>
          </div>
        </div>

        <section className="grid gap-4 rounded-2xl border border-white/10 bg-[linear-gradient(160deg,rgba(9,19,35,0.9),rgba(4,10,22,0.88))] p-5">
          <h2 className="text-xl font-semibold text-[#dce4ef]">Фильтры контента</h2>
          <form className="grid gap-3 md:grid-cols-4">
            <input
              name="qNews"
              defaultValue={qNews}
              placeholder="Поиск по новостям..."
              className="rounded-md border border-white/12 bg-[#071327] px-3 py-2 text-[#d8dfeb] outline-none placeholder:text-[#637188] focus:border-[#4e5f79]"
            />
            <input
              name="qProducts"
              defaultValue={qProducts}
              placeholder="Поиск по товарам..."
              className="rounded-md border border-white/12 bg-[#071327] px-3 py-2 text-[#d8dfeb] outline-none placeholder:text-[#637188] focus:border-[#4e5f79]"
            />
            <select
              name="projectId"
              defaultValue={projectId}
              className="rounded-md border border-white/12 bg-[#071327] px-3 py-2 text-[#d8dfeb] outline-none focus:border-[#4e5f79]"
            >
              <option value="">Все проекты</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
            <label className="flex items-center gap-2 rounded-md border border-white/12 bg-[#071327] px-3 py-2 text-sm text-[#d8dfeb]">
              <input type="checkbox" name="missing" value="1" defaultChecked={missingOnly} className="size-4" />
              Только с неполными переводами
            </label>

            <div className="md:col-span-4 flex flex-wrap gap-2">
              <button
                type="submit"
                className="rounded-md border border-white/15 bg-[#0b1629] px-4 py-2 text-sm font-medium text-[#d9e0ed] transition hover:border-[#ff6a00]/55 hover:text-white"
              >
                Применить
              </button>
              <Link
                href="/admin"
                className="rounded-md border border-white/15 bg-transparent px-4 py-2 text-sm font-medium text-[#98a6bc] transition hover:border-white/25 hover:text-[#d9e0ed]"
              >
                Сбросить
              </Link>
            </div>
          </form>
        </section>

        <section className="grid gap-4 rounded-2xl border border-white/10 bg-[linear-gradient(160deg,rgba(9,19,35,0.9),rgba(4,10,22,0.88))] p-5">
          <h2 className="text-xl font-semibold text-[#dce4ef]">1. Проекты</h2>
          <form action={createProjectAction} className="grid gap-3 md:grid-cols-[1fr_auto]">
            <input
              name="name"
              placeholder="Название проекта"
              required
              className="rounded-md border border-white/12 bg-[#071327] px-3 py-2 text-[#d8dfeb] outline-none placeholder:text-[#637188] focus:border-[#4e5f79]"
            />
            <button
              className="rounded-md border border-white/15 bg-[#0b1629] px-4 py-2 font-medium text-[#d9e0ed] transition hover:border-[#ff6a00]/55 hover:text-white"
              type="submit"
            >
              Добавить проект
            </button>
          </form>

          <div className="max-h-[360px] overflow-x-auto overflow-y-auto rounded-xl border border-white/10">
            <table className="w-full text-left text-sm text-[#c8d2e2]">
              <thead className="bg-[#081326] text-[#9aa8be]">
                <tr>
                  <th className="p-3">Проект</th>
                  <th className="p-3">Slug</th>
                  <th className="p-3">Новости</th>
                  <th className="p-3">Товары</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id} className="border-t border-white/10">
                    <td className="p-3">{project.name}</td>
                    <td className="p-3">{project.slug}</td>
                    <td className="p-3">{project._count.news}</td>
                    <td className="p-3">{project._count.products}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid gap-4 rounded-2xl border border-white/10 bg-[linear-gradient(160deg,rgba(9,19,35,0.9),rgba(4,10,22,0.88))] p-5">
          <h2 className="text-xl font-semibold text-[#dce4ef]">2. Новости (slug генерируется автоматически)</h2>
          <NewsEditorForm
            action={createNewsAction}
            submitLabel="Опубликовать новость"
            projects={projects.map((p) => ({ id: p.id, name: p.name }))}
            locales={i18n.locales}
          />

          <div className="max-h-[360px] overflow-x-auto overflow-y-auto rounded-xl border border-white/10">
            <table className="w-full text-left text-sm text-[#c8d2e2]">
              <thead className="bg-[#081326] text-[#9aa8be]">
                <tr>
                  <th className="p-3">Заголовок (RU base)</th>
                  <th className="p-3">Slug</th>
                  <th className="p-3">Проект</th>
                  <th className="p-3">Переводы</th>
                  <th className="p-3">Дата</th>
                  <th className="p-3">Действия</th>
                </tr>
              </thead>
              <tbody>
                {visibleNews.map((item) => {
                  const translatedLocales = new Set(item.translations.map((translation) => translation.locale));

                  return (
                    <tr key={item.id} className="border-t border-white/10">
                      <td className="p-3">{item.title}</td>
                      <td className="p-3">{item.slug}</td>
                      <td className="p-3">{item.project.name}</td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          {i18n.locales.map((locale) => (
                            <span
                              key={locale}
                              className={`rounded px-2 py-1 text-xs font-semibold ${
                                translatedLocales.has(locale)
                                  ? 'bg-emerald-900/40 text-emerald-200'
                                  : 'bg-[#223149] text-[#9babbe]'
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
                          <Link href={`/admin/news/${item.id}`} className="text-sky-300 transition hover:text-sky-200">
                            Редактировать
                          </Link>
                          <form action={deleteNewsAction}>
                            <input type="hidden" name="id" value={item.id} />
                            <button type="submit" className="text-red-300 transition hover:text-red-200">
                              Удалить
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {visibleNews.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-3 text-[#8f9db2]">
                      Новостей по текущим фильтрам нет.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid gap-4 rounded-2xl border border-white/10 bg-[linear-gradient(160deg,rgba(9,19,35,0.9),rgba(4,10,22,0.88))] p-5">
          <h2 className="text-xl font-semibold text-[#dce4ef]">3. Товары (slug генерируется автоматически)</h2>
          <ProductEditorForm
            action={createProductAction}
            submitLabel="Создать товар"
            projects={projects.map((p) => ({ id: p.id, name: p.name }))}
            locales={i18n.locales}
          />

          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-left text-sm text-[#c8d2e2]">
              <thead className="bg-[#081326] text-[#9aa8be]">
                <tr>
                  <th className="p-3">Название (RU base)</th>
                  <th className="p-3">Slug</th>
                  <th className="p-3">Цена</th>
                  <th className="p-3">Проект</th>
                  <th className="p-3">Переводы</th>
                  <th className="p-3">Действия</th>
                </tr>
              </thead>
              <tbody>
                {visibleProducts.map((item) => {
                  const translatedLocales = new Set(item.translations.map((translation) => translation.locale));
                  const ru = item.translations.find((translation) => translation.locale === 'ru');

                  return (
                    <tr key={item.id} className="border-t border-white/10">
                      <td className="p-3">{ru?.name ?? '—'}</td>
                      <td className="p-3">{item.slug}</td>
                      <td className="p-3">{item.price || '—'}</td>
                      <td className="p-3">{item.project.name}</td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          {i18n.locales.map((locale) => (
                            <span
                              key={locale}
                              className={`rounded px-2 py-1 text-xs font-semibold ${
                                translatedLocales.has(locale)
                                  ? 'bg-emerald-900/40 text-emerald-200'
                                  : 'bg-[#223149] text-[#9babbe]'
                              }`}
                            >
                              {locale.toUpperCase()}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <Link
                            href={`/admin/products/${item.id}`}
                            className="text-sky-300 transition hover:text-sky-200"
                          >
                            Редактировать
                          </Link>
                          <form action={deleteProductAction}>
                            <input type="hidden" name="id" value={item.id} />
                            <button type="submit" className="text-red-300 transition hover:text-red-200">
                              Удалить
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {visibleProducts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-3 text-[#8f9db2]">
                      Товаров по текущим фильтрам нет.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
