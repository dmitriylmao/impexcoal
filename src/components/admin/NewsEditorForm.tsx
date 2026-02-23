'use client';

import { useMemo, useRef, useState } from 'react';
import type { Locale } from '@/i18n/config';

type Option = {
  id: string;
  name: string;
};

type FormAction = (formData: FormData) => void | Promise<void>;

type InitialTranslations = Partial<Record<Locale, { title: string; content: string }>>;

type NewsFormInitial = {
  id?: string;
  slug?: string;
  imgUrl?: string | null;
  projectId?: string;
  categoryId?: string;
  translations?: InitialTranslations;
};

type Props = {
  action: FormAction;
  submitLabel: string;
  projects: Option[];
  categories: Option[];
  locales: readonly Locale[];
  initial?: NewsFormInitial;
};

type PreviewData = {
  slug: string;
  imageUrl: string;
  projectName: string;
  categoryName: string;
  translations: Record<string, { title: string; content: string }>;
};

export default function NewsEditorForm({ action, submitLabel, projects, categories, locales, initial }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [preview, setPreview] = useState<PreviewData | null>(null);

  const localeLabels = useMemo<Record<Locale, string>>(
    () => ({
      ru: 'RU',
      en: 'EN',
      tr: 'TR',
    }),
    [],
  );

  const buildPreview = () => {
    if (!formRef.current) return;

    const data = new FormData(formRef.current);
    const projectId = String(data.get('projectId') ?? '');
    const categoryId = String(data.get('categoryId') ?? '');

    const translations: Record<string, { title: string; content: string }> = {};
    for (const locale of locales) {
      translations[locale] = {
        title: String(data.get(`title_${locale}`) ?? '').trim(),
        content: String(data.get(`content_${locale}`) ?? '').trim(),
      };
    }

    setPreview({
      slug: String(data.get('slug') ?? '').trim(),
      imageUrl: String(data.get('imgUrl') ?? '').trim(),
      projectName: projects.find((project) => project.id === projectId)?.name ?? '-',
      categoryName: categories.find((category) => category.id === categoryId)?.name ?? '-',
      translations,
    });

    dialogRef.current?.showModal();
  };

  const closePreview = () => {
    dialogRef.current?.close();
  };

  return (
    <>
      <form ref={formRef} action={action} className="grid gap-4">
        {initial?.id ? <input type="hidden" name="id" value={initial.id} /> : null}

        <input
          name="slug"
          placeholder="slug (например, postavki-iz-kuzbassa)"
          required
          defaultValue={initial?.slug ?? ''}
          className="rounded-md border p-3"
        />
        <input
          name="imgUrl"
          placeholder="URL изображения (необязательно)"
          defaultValue={initial?.imgUrl ?? ''}
          className="rounded-md border p-3"
        />

        <div className="grid gap-3 md:grid-cols-2">
          <select name="projectId" defaultValue={initial?.projectId ?? ''} required className="rounded-md border p-3">
            <option value="" disabled>
              Выберите проект
            </option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>

          <select
            name="categoryId"
            defaultValue={initial?.categoryId ?? ''}
            required
            className="rounded-md border p-3"
          >
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

        <div className="grid gap-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-600">Контент по языкам</h3>

          {locales.map((locale) => (
            <div key={locale} className="grid gap-3">
              <label className="text-sm font-medium">
                Заголовок ({localeLabels[locale]}
                {locale === 'ru' ? ', обязательно' : ', optional'})
              </label>
              <input
                name={`title_${locale}`}
                required={locale === 'ru'}
                defaultValue={initial?.translations?.[locale]?.title ?? ''}
                className="rounded-md border bg-white p-3"
              />

              <label className="text-sm font-medium">
                Текст ({localeLabels[locale]}
                {locale === 'ru' ? ', обязательно' : ', optional'})
              </label>
              <textarea
                name={`content_${locale}`}
                required={locale === 'ru'}
                defaultValue={initial?.translations?.[locale]?.content ?? ''}
                className="min-h-24 rounded-md border bg-white p-3"
              />
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={buildPreview}
            className="rounded-md border border-zinc-300 px-4 py-3 font-medium text-zinc-700 hover:bg-zinc-100"
          >
            Предпросмотр
          </button>
          <button
            className="rounded-md bg-zinc-900 px-4 py-3 font-medium text-white disabled:cursor-not-allowed disabled:bg-zinc-400"
            type="submit"
            disabled={projects.length === 0 || categories.length === 0}
          >
            {submitLabel}
          </button>
        </div>
      </form>

      <dialog
        ref={dialogRef}
        className="w-full max-w-3xl rounded-xl border border-zinc-200 p-0 shadow-xl backdrop:bg-black/40"
      >
        <div className="grid gap-5 p-6">
          <div className="flex items-center justify-between gap-4 border-b border-zinc-200 pb-4">
            <h3 className="text-lg font-semibold">Предпросмотр новости</h3>
            <button
              type="button"
              onClick={closePreview}
              className="rounded-md border border-zinc-300 px-3 py-1 text-sm hover:bg-zinc-100"
            >
              Закрыть
            </button>
          </div>

          {preview ? (
            <div className="grid gap-4">
              <div className="grid gap-2 text-sm text-zinc-600">
                <p>
                  <span className="font-medium text-zinc-900">Slug:</span> {preview.slug || '-'}
                </p>
                <p>
                  <span className="font-medium text-zinc-900">Проект:</span> {preview.projectName}
                </p>
                <p>
                  <span className="font-medium text-zinc-900">Категория:</span> {preview.categoryName}
                </p>
              </div>

              {preview.imageUrl ? (
                <img src={preview.imageUrl} alt="Preview" className="h-56 w-full rounded-lg object-cover" />
              ) : null}

              <div className="grid gap-4">
                {locales.map((locale) => {
                  const t = preview.translations[locale];
                  return (
                    <article key={locale} className="rounded-lg border border-zinc-200 p-4">
                      <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-zinc-600">
                        {localeLabels[locale]}
                      </h4>
                      <p className="text-xl font-semibold text-zinc-900">{t?.title || '-'}</p>
                      <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-700">{t?.content || '-'}</p>
                    </article>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      </dialog>
    </>
  );
}