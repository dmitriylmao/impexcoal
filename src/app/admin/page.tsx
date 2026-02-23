import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

export default async function AdminPage() {
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
      include: { project: true, category: true },
    }),
  ]);

  async function createProject(formData: FormData) {
    'use server';

    const name = String(formData.get('name') ?? '').trim();
    const slug = String(formData.get('slug') ?? '').trim();

    if (!name || !slug) return;

    await prisma.project.create({
      data: { name, slug },
    });

    revalidatePath('/admin');
  }

  async function createCategory(formData: FormData) {
    'use server';

    const name = String(formData.get('name') ?? '').trim();
    const projectId = String(formData.get('projectId') ?? '').trim();

    if (!name || !projectId) return;

    await prisma.category.create({
      data: { name, projectId },
    });

    revalidatePath('/admin');
  }

  async function createNews(formData: FormData) {
    'use server';

    const title = String(formData.get('title') ?? '').trim();
    const slug = String(formData.get('slug') ?? '').trim();
    const content = String(formData.get('content') ?? '').trim();
    const imgUrlRaw = String(formData.get('imgUrl') ?? '').trim();
    const projectId = String(formData.get('projectId') ?? '').trim();
    const categoryId = String(formData.get('categoryId') ?? '').trim();

    if (!title || !slug || !content || !projectId || !categoryId) return;

    await prisma.news.create({
      data: {
        title,
        slug,
        content,
        imgUrl: imgUrlRaw || null,
        projectId,
        categoryId,
      },
    });

    revalidatePath('/admin');
    revalidatePath('/');
  }

  async function deleteNews(formData: FormData) {
    'use server';

    const id = String(formData.get('id') ?? '');
    if (!id) return;

    await prisma.news.delete({ where: { id } });

    revalidatePath('/admin');
    revalidatePath('/');
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 p-6 font-sans md:p-10">
      <h1 className="text-3xl font-bold">Админ-панель IMPEX Coal</h1>

      <section className="grid gap-4 rounded-2xl border border-zinc-200 p-5">
        <h2 className="text-xl font-semibold">1. Проекты</h2>
        <form action={createProject} className="grid gap-3 md:grid-cols-3">
          <input
            name="name"
            placeholder="Название проекта"
            required
            className="rounded-md border p-3"
          />
          <input
            name="slug"
            placeholder="slug (например, coal)"
            required
            className="rounded-md border p-3"
          />
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
              {projects.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-3 text-zinc-500">
                    Проекты пока не созданы.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-4 rounded-2xl border border-zinc-200 p-5">
        <h2 className="text-xl font-semibold">2. Категории</h2>
        <form action={createCategory} className="grid gap-3 md:grid-cols-3">
          <input
            name="name"
            placeholder="Название категории"
            required
            className="rounded-md border p-3"
          />
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
        <div className="overflow-x-auto rounded-md border border-zinc-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50">
              <tr>
                <th className="p-3">Категория</th>
                <th className="p-3">Проект</th>
                <th className="p-3">Новостей</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} className="border-t">
                  <td className="p-3">{category.name}</td>
                  <td className="p-3">{category.project.name}</td>
                  <td className="p-3">{category._count.news}</td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-3 text-zinc-500">
                    Категории пока не созданы.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-4 rounded-2xl border border-zinc-200 p-5">
        <h2 className="text-xl font-semibold">3. Новости</h2>
        <form action={createNews} className="grid gap-3">
          <input name="title" placeholder="Заголовок" required className="rounded-md border p-3" />
          <input
            name="slug"
            placeholder="slug (например, postavki-iz-kuzbassa)"
            required
            className="rounded-md border p-3"
          />
          <textarea
            name="content"
            placeholder="Текст новости"
            required
            className="min-h-40 rounded-md border p-3"
          />
          <input name="imgUrl" placeholder="URL изображения (необязательно)" className="rounded-md border p-3" />
          <div className="grid gap-3 md:grid-cols-2">
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
            <select name="categoryId" defaultValue="" required className="rounded-md border p-3">
              <option value="" disabled>
                Выберите категорию
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <button
            className="w-fit rounded-md bg-zinc-900 px-4 py-3 font-medium text-white disabled:cursor-not-allowed disabled:bg-zinc-400"
            type="submit"
            disabled={projects.length === 0 || categories.length === 0}
          >
            Опубликовать новость
          </button>
        </form>

        <div className="overflow-x-auto rounded-md border border-zinc-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50">
              <tr>
                <th className="p-3">Заголовок</th>
                <th className="p-3">Проект</th>
                <th className="p-3">Категория</th>
                <th className="p-3">Дата</th>
                <th className="p-3">Действие</th>
              </tr>
            </thead>
            <tbody>
              {news.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="p-3">{item.title}</td>
                  <td className="p-3">{item.project.name}</td>
                  <td className="p-3">{item.category.name}</td>
                  <td className="p-3">{new Date(item.publishedAt).toLocaleDateString('ru-RU')}</td>
                  <td className="p-3">
                    <form action={deleteNews}>
                      <input type="hidden" name="id" value={item.id} />
                      <button type="submit" className="text-red-600 hover:underline">
                        Удалить
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
              {news.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-3 text-zinc-500">
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
