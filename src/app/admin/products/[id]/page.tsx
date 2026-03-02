import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { requireAdminAuthOrRedirect } from '@/lib/admin-auth';
import { i18n, type Locale } from '@/i18n/config';
import ProductEditorForm from '@/components/admin/ProductEditorForm';
import { updateProductAction } from '@/app/admin/actions';

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminAuthOrRedirect();

  const { id } = await params;

  const [product, projects] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { translations: true },
    }),
    prisma.project.findMany({ orderBy: { name: 'asc' } }),
  ]);

  if (!product) {
    notFound();
  }

  const translations = product.translations.reduce<Partial<Record<Locale, { name: string; description: string }>>>(
    (acc, item) => {
      if (i18n.locales.includes(item.locale as Locale)) {
        acc[item.locale as Locale] = { name: item.name, description: item.description };
      }

      return acc;
    },
    {},
  );

  return (
    <div className="min-h-screen bg-[#020914]">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6 md:px-8 md:py-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-bold text-[#dce4ef]">Редактирование товара</h1>
          <Link
            href="/admin"
            className="rounded-md border border-white/15 bg-[#0b1629] px-4 py-2 text-sm text-[#d9e0ed] transition hover:border-[#ff6a00]/55 hover:text-white"
          >
            Назад в админку
          </Link>
        </div>

        <section className="rounded-2xl border border-white/10 bg-[linear-gradient(160deg,rgba(9,19,35,0.9),rgba(4,10,22,0.88))] p-5">
          <ProductEditorForm
            action={updateProductAction}
            submitLabel="Сохранить изменения"
            projects={projects.map((p) => ({ id: p.id, name: p.name }))}
            locales={i18n.locales}
            initial={{
              id: product.id,
              imgUrl: product.imgUrl,
              price: product.price,
              projectId: product.projectId,
              translations,
            }}
          />
        </section>
      </div>
    </div>
  );
}
