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
        className="rounded-md border border-white/12 bg-[#071327] px-3 py-2 text-[#d8dfeb] outline-none placeholder:text-[#637188] focus:border-[#4e5f79]"
      />
      <input
        name="price"
        placeholder="Цена (необязательно)"
        defaultValue={initial?.price ?? ''}
        className="rounded-md border border-white/12 bg-[#071327] px-3 py-2 text-[#d8dfeb] outline-none placeholder:text-[#637188] focus:border-[#4e5f79]"
      />

      <select
        name="projectId"
        defaultValue={initial?.projectId ?? ''}
        required
        className="rounded-md border border-white/12 bg-[#071327] px-3 py-2 text-[#d8dfeb] outline-none focus:border-[#4e5f79]"
      >
        <option value="" disabled>
          Выберите проект
        </option>
        {projects.map((project) => (
          <option key={project.id} value={project.id}>
            {project.name}
          </option>
        ))}
      </select>

      <div className="grid gap-4 rounded-xl border border-white/12 bg-[#081428]/75 p-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[#9aa8be]">Контент по языкам</h3>

        {locales.map((locale) => (
          <div key={locale} className="grid gap-3 rounded-lg border border-white/10 bg-[#061224]/70 p-3">
            <label className="text-sm font-medium text-[#bdc9db]">
              Название ({localeLabels[locale]}
              {locale === 'ru' ? ', обязательно' : ', optional'})
            </label>
            <input
              name={`name_${locale}`}
              required={locale === 'ru'}
              defaultValue={initial?.translations?.[locale]?.name ?? ''}
              className="rounded-md border border-white/12 bg-[#071327] px-3 py-2 text-[#d8dfeb] outline-none placeholder:text-[#637188] focus:border-[#4e5f79]"
            />

            <label className="text-sm font-medium text-[#bdc9db]">
              Описание ({localeLabels[locale]}
              {locale === 'ru' ? ', обязательно' : ', optional'})
            </label>
            <textarea
              name={`description_${locale}`}
              required={locale === 'ru'}
              defaultValue={initial?.translations?.[locale]?.description ?? ''}
              className="min-h-24 rounded-md border border-white/12 bg-[#071327] px-3 py-2 text-[#d8dfeb] outline-none placeholder:text-[#637188] focus:border-[#4e5f79]"
            />
          </div>
        ))}
      </div>

      <button
        className="rounded-md border border-white/15 bg-[#0b1629] px-4 py-3 font-medium text-[#d9e0ed] transition hover:border-[#ff6a00]/55 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        type="submit"
        disabled={projects.length === 0}
      >
        {submitLabel}
      </button>
    </form>
  );
}
