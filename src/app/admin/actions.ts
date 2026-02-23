'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { signOutAdmin, requireAdminAuthOrRedirect } from '@/lib/admin-auth';
import { i18n, type Locale } from '@/i18n/config';

type TranslationInput = {
  locale: Locale;
  title: string;
  content: string;
};

function getTranslationInputs(formData: FormData): TranslationInput[] {
  return i18n.locales
    .map((locale) => {
      const title = String(formData.get(`title_${locale}`) ?? '').trim();
      const content = String(formData.get(`content_${locale}`) ?? '').trim();

      if (!title || !content) {
        return null;
      }

      return { locale, title, content } satisfies TranslationInput;
    })
    .filter((item): item is TranslationInput => item !== null);
}

async function revalidatePublicPages() {
  revalidatePath('/');
  for (const locale of i18n.locales) {
    revalidatePath(`/${locale}`);
  }
}

export async function logoutAdminAction() {
  await requireAdminAuthOrRedirect();
  await signOutAdmin();
  redirect('/admin/login');
}

export async function createProjectAction(formData: FormData) {
  await requireAdminAuthOrRedirect();

  const name = String(formData.get('name') ?? '').trim();
  const slug = String(formData.get('slug') ?? '').trim();

  if (!name || !slug) return;

  await prisma.project.create({ data: { name, slug } });
  revalidatePath('/admin');
}

export async function createCategoryAction(formData: FormData) {
  await requireAdminAuthOrRedirect();

  const name = String(formData.get('name') ?? '').trim();
  const projectId = String(formData.get('projectId') ?? '').trim();

  if (!name || !projectId) return;

  await prisma.category.create({ data: { name, projectId } });
  revalidatePath('/admin');
}

export async function createNewsAction(formData: FormData) {
  await requireAdminAuthOrRedirect();

  const slug = String(formData.get('slug') ?? '').trim();
  const imgUrlRaw = String(formData.get('imgUrl') ?? '').trim();
  const projectId = String(formData.get('projectId') ?? '').trim();
  const categoryId = String(formData.get('categoryId') ?? '').trim();

  const translations = getTranslationInputs(formData);
  const russian = translations.find((item) => item.locale === i18n.defaultLocale);

  if (!slug || !projectId || !categoryId || !russian) return;

  await prisma.news.create({
    data: {
      slug,
      imgUrl: imgUrlRaw || null,
      projectId,
      categoryId,
      title: russian.title,
      content: russian.content,
      translations: {
        createMany: {
          data: translations,
        },
      },
    },
  });

  revalidatePath('/admin');
  await revalidatePublicPages();
}

export async function updateNewsAction(formData: FormData) {
  await requireAdminAuthOrRedirect();

  const id = String(formData.get('id') ?? '').trim();
  const slug = String(formData.get('slug') ?? '').trim();
  const imgUrlRaw = String(formData.get('imgUrl') ?? '').trim();
  const projectId = String(formData.get('projectId') ?? '').trim();
  const categoryId = String(formData.get('categoryId') ?? '').trim();

  const translations = getTranslationInputs(formData);
  const russian = translations.find((item) => item.locale === i18n.defaultLocale);

  if (!id || !slug || !projectId || !categoryId || !russian) return;

  await prisma.news.update({
    where: { id },
    data: {
      slug,
      imgUrl: imgUrlRaw || null,
      projectId,
      categoryId,
      title: russian.title,
      content: russian.content,
      translations: {
        deleteMany: {},
        createMany: {
          data: translations,
        },
      },
    },
  });

  revalidatePath('/admin');
  revalidatePath(`/admin/news/${id}`);
  await revalidatePublicPages();
  redirect('/admin');
}

export async function deleteNewsAction(formData: FormData) {
  await requireAdminAuthOrRedirect();

  const id = String(formData.get('id') ?? '').trim();
  if (!id) return;

  await prisma.news.delete({ where: { id } });

  revalidatePath('/admin');
  await revalidatePublicPages();
}