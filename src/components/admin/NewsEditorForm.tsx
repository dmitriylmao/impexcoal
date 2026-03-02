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
  imgUrl?: string | null;
  projectId?: string;
  translations?: InitialTranslations;
};

type Props = {
  action: FormAction;
  submitLabel: string;
  projects: Option[];
  locales: readonly Locale[];
  initial?: NewsFormInitial;
};

type PreviewData = {
  imageUrl: string;
  projectName: string;
  translations: Record<string, { title: string; content: string }>;
};

export default function NewsEditorForm({ action, submitLabel, projects, locales, initial }: Props) {
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

    const translations: Record<string, { title: string; content: string }> = {};
    for (const locale of locales) {
      translations[locale] = {
        title: String(data.get(`title_${locale}`) ?? '').trim(),
        content: String(data.get(`content_${locale}`) ?? '').trim(),
      };
    }

    setPreview({
      imageUrl: String(data.get('imgUrl') ?? '').trim(),
      projectName: projects.find((project) => project.id === projectId)?.name ?? '-',
      translations,
    });

    dialogRef.current?.showModal();
  };

  return (
    <>
      <form ref={formRef} action={action} className="grid gap-4">
        {initial?.id ? <input type="hidden" name="id" value={initial.id} /> : null}

        <input
          name="imgUrl"
          placeholder="URL изображения (необязательно)"
          defaultValue={initial?.imgUrl ?? ''}
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
                Заголовок ({localeLabels[locale]}
                {locale === 'ru' ? ', обязательно' : ', optional'})
              </label>
              <input
                name={`title_${locale}`}
                required={locale === 'ru'}
                defaultValue={initial?.translations?.[locale]?.title ?? ''}
                className="rounded-md border border-white/12 bg-[#071327] px-3 py-2 text-[#d8dfeb] outline-none placeholder:text-[#637188] focus:border-[#4e5f79]"
              />

              <label className="text-sm font-medium text-[#bdc9db]">
                Текст ({localeLabels[locale]}
                {locale === 'ru' ? ', обязательно' : ', optional'})
              </label>
              <textarea
                name={`content_${locale}`}
                required={locale === 'ru'}
                defaultValue={initial?.translations?.[locale]?.content ?? ''}
                className="min-h-24 rounded-md border border-white/12 bg-[#071327] px-3 py-2 text-[#d8dfeb] outline-none placeholder:text-[#637188] focus:border-[#4e5f79]"
              />
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={buildPreview}
            className="rounded-md border border-white/15 bg-[#0b1629] px-4 py-3 font-medium text-[#d9e0ed] transition hover:border-white/25 hover:text-white"
          >
            Предпросмотр
          </button>
          <button
            className="rounded-md border border-white/15 bg-[#0b1629] px-4 py-3 font-medium text-[#d9e0ed] transition hover:border-[#ff6a00]/55 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            type="submit"
            disabled={projects.length === 0}
          >
            {submitLabel}
          </button>
        </div>
      </form>

      <dialog
        ref={dialogRef}
        className="w-full max-w-3xl rounded-xl border border-white/10 bg-[#061224] p-0 text-[#d8dfeb] shadow-xl backdrop:bg-black/60"
      >
        <div className="grid gap-5 p-6">
          <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
            <h3 className="text-lg font-semibold">Предпросмотр новости</h3>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="rounded-md border border-white/15 px-3 py-1 text-sm text-[#cdd7e6] transition hover:border-white/30 hover:text-white"
            >
              Закрыть
            </button>
          </div>

          {preview ? (
            <div className="grid gap-4">
              <div className="grid gap-2 text-sm text-[#99a8bf]">
                <p>
                  <span className="font-medium text-[#dce4ef]">Проект:</span> {preview.projectName}
                </p>
              </div>

              {preview.imageUrl ? (
                <img src={preview.imageUrl} alt="Preview" className="h-56 w-full rounded-lg object-cover" />
              ) : null}

              <div className="grid gap-4">
                {locales.map((locale) => {
                  const t = preview.translations[locale];
                  return (
                    <article key={locale} className="rounded-lg border border-white/10 bg-[#081428]/75 p-4">
                      <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#9aa8be]">
                        {localeLabels[locale]}
                      </h4>
                      <p className="text-xl font-semibold text-[#dce4ef]">{t?.title || '-'}</p>
                      <p className="mt-2 whitespace-pre-wrap text-sm text-[#b4c0d4]">{t?.content || '-'}</p>
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
