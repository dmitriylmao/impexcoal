'use client';

import { useMemo } from 'react';
import type { Locale } from '@/i18n/config';

type Option = {
  id: string;
  name: string;
};

type FormAction = (formData: FormData) => void | Promise<void>;

type InitialTranslations = Partial<Record<Locale, { name: string; description: string }>>;

type ProductFormInitial = {
  id?: string;
  imgUrl?: string;
  price?: string | null;
  projectId?: string;
  translations?: InitialTranslations;
};

type Props = {
  action: FormAction;
  submitLabel: string;
  projects: Option[];
  locales: readonly Locale[];
  initial?: ProductFormInitial;
};

export default function ProductEditorForm({ action, submitLabel, projects, locales, initial }: Props) {
  const localeLabels = useMemo<Record<Locale, string>>(
    () => ({
      ru: 'RU',
      en: 'EN',
      tr: 'TR',
    }),
    [],
  );

  return (
    <form action={action} className="grid gap-4">
      {initial?.id ? <input type="hidden" name="id" value={initial.id} /> : null}

      <input
        name="imgUrl"
        placeholder="URL изображения (обязательно)"
        required
        defaultValue={initial?.imgUrl ?? ''}
        className="rounded-md border p-3"
      />
      <input
        name="price"
        placeholder="Цена (необязательно)"
        defaultValue={initial?.price ?? ''}
        className="rounded-md border p-3"
      />

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

      <div className="grid gap-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-600">Контент по языкам</h3>

        {locales.map((locale) => (
          <div key={locale} className="grid gap-3">
            <label className="text-sm font-medium">
              Название ({localeLabels[locale]}
              {locale === 'ru' ? ', обязательно' : ', optional'})
            </label>
            <input
              name={`name_${locale}`}
              required={locale === 'ru'}
              defaultValue={initial?.translations?.[locale]?.name ?? ''}
              className="rounded-md border bg-white p-3"
            />

            <label className="text-sm font-medium">
              Описание ({localeLabels[locale]}
              {locale === 'ru' ? ', обязательно' : ', optional'})
            </label>
            <textarea
              name={`description_${locale}`}
              required={locale === 'ru'}
              defaultValue={initial?.translations?.[locale]?.description ?? ''}
              className="min-h-24 rounded-md border bg-white p-3"
            />
          </div>
        ))}
      </div>

      <button
        className="rounded-md bg-zinc-900 px-4 py-3 font-medium text-white disabled:cursor-not-allowed disabled:bg-zinc-400"
        type="submit"
        disabled={projects.length === 0}
      >
        {submitLabel}
      </button>
    </form>
  );
}
