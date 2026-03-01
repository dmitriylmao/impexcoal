'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { signOutAdmin, requireAdminAuthOrRedirect } from '@/lib/admin-auth';
import { i18n, type Locale } from '@/i18n/config';
import { generateUniqueSlug } from '@/lib/slug';

type NewsTranslationInput = {
  locale: Locale;
  title: string;
  content: string;
};

type ProductTranslationInput = {
  locale: Locale;
  name: string;
  description: string;
};

function getNewsTranslationInputs(formData: FormData): NewsTranslationInput[] {
  return i18n.locales
    .map((locale) => {
      const title = String(formData.get(`title_${locale}`) ?? '').trim();
      const content = String(formData.get(`content_${locale}`) ?? '').trim();
      if (!title || !content) return null;
      return { locale, title, content } satisfies NewsTranslationInput;
    })
    .filter((item): item is NewsTranslationInput => item !== null);
}

function getProductTranslationInputs(formData: FormData): ProductTranslationInput[] {
  return i18n.locales
    .map((locale) => {
      const name = String(formData.get(`name_${locale}`) ?? '').trim();
      const description = String(formData.get(`description_${locale}`) ?? '').trim();
      if (!name || !description) return null;
      return { locale, name, description } satisfies ProductTranslationInput;
    })
    .filter((item): item is ProductTranslationInput => item !== null);
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
  if (!name) return;

  const slug = await generateUniqueSlug(name, async (candidate) => {
    const exists = await prisma.project.findUnique({ where: { slug: candidate }, select: { id: true } });
    return Boolean(exists);
  });

  await prisma.project.create({ data: { name, slug } });
  revalidatePath('/admin');
}

export async function createNewsAction(formData: FormData) {
  await requireAdminAuthOrRedirect();

  const imgUrlRaw = String(formData.get('imgUrl') ?? '').trim();
  const projectId = String(formData.get('projectId') ?? '').trim();

  const translations = getNewsTranslationInputs(formData);
  const russian = translations.find((item) => item.locale === i18n.defaultLocale);

  if (!projectId || !russian) return;

  const slug = await generateUniqueSlug(russian.title, async (candidate) => {
    const exists = await prisma.news.findUnique({ where: { slug: candidate }, select: { id: true } });
    return Boolean(exists);
  });

  await prisma.news.create({
    data: {
      slug,
      imgUrl: imgUrlRaw || null,
      projectId,
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
  const imgUrlRaw = String(formData.get('imgUrl') ?? '').trim();
  const projectId = String(formData.get('projectId') ?? '').trim();

  const translations = getNewsTranslationInputs(formData);
  const russian = translations.find((item) => item.locale === i18n.defaultLocale);

  if (!id || !projectId || !russian) return;

  const slug = await generateUniqueSlug(russian.title, async (candidate) => {
    const exists = await prisma.news.findFirst({
      where: { slug: candidate, NOT: { id } },
      select: { id: true },
    });
    return Boolean(exists);
  });

  await prisma.news.update({
    where: { id },
    data: {
      slug,
      imgUrl: imgUrlRaw || null,
      projectId,
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

export async function createProductAction(formData: FormData) {
  await requireAdminAuthOrRedirect();

  const imgUrl = String(formData.get('imgUrl') ?? '').trim();
  const price = String(formData.get('price') ?? '').trim();
  const projectId = String(formData.get('projectId') ?? '').trim();

  const translations = getProductTranslationInputs(formData);
  const russian = translations.find((item) => item.locale === i18n.defaultLocale);

  if (!projectId || !imgUrl || !russian) return;

  const slug = await generateUniqueSlug(russian.name, async (candidate) => {
    const exists = await prisma.product.findUnique({ where: { slug: candidate }, select: { id: true } });
    return Boolean(exists);
  });

  await prisma.product.create({
    data: {
      slug,
      imgUrl,
      price: price || null,
      projectId,
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

export async function updateProductAction(formData: FormData) {
  await requireAdminAuthOrRedirect();

  const id = String(formData.get('id') ?? '').trim();
  const imgUrl = String(formData.get('imgUrl') ?? '').trim();
  const price = String(formData.get('price') ?? '').trim();
  const projectId = String(formData.get('projectId') ?? '').trim();

  const translations = getProductTranslationInputs(formData);
  const russian = translations.find((item) => item.locale === i18n.defaultLocale);

  if (!id || !projectId || !imgUrl || !russian) return;

  const slug = await generateUniqueSlug(russian.name, async (candidate) => {
    const exists = await prisma.product.findFirst({
      where: { slug: candidate, NOT: { id } },
      select: { id: true },
    });
    return Boolean(exists);
  });

  await prisma.product.update({
    where: { id },
    data: {
      slug,
      imgUrl,
      price: price || null,
      projectId,
      translations: {
        deleteMany: {},
        createMany: {
          data: translations,
        },
      },
    },
  });

  revalidatePath('/admin');
  revalidatePath(`/admin/products/${id}`);
  await revalidatePublicPages();
  redirect('/admin');
}

export async function deleteProductAction(formData: FormData) {
  await requireAdminAuthOrRedirect();

  const id = String(formData.get('id') ?? '').trim();
  if (!id) return;

  await prisma.product.delete({ where: { id } });

  revalidatePath('/admin');
  await revalidatePublicPages();
}
