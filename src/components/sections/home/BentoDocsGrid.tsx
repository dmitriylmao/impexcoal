import fs from 'node:fs';
import path from 'node:path';
import BentoDocsGridClient from './BentoDocsGridClient';

type DocumentTitles = {
  anthraciteAko: string;
  anthraciteAm1325: string;
  anthraciteAs613: string;
  anthraciteAsh06: string;
  inspectionTs613: string;
  coalT13100: string;
  coalT6500: string;
  coalT6000: string;
};

export type BentoDocument = {
  id: string;
  title: string;
  href: string;
  previewHref: string | null;
  group: 'anthracite' | 'coal';
  order: number;
};

type BentoDocsGridProps = {
  badge: string;
  emptyLabel: string;
  downloadLabel: string;
  documentTitles: DocumentTitles;
};

const TITLE_KEY_ORDER: Array<keyof DocumentTitles> = [
  'anthraciteAko',
  'anthraciteAm1325',
  'anthraciteAs613',
  'anthraciteAsh06',
  'inspectionTs613',
  'coalT13100',
  'coalT6500',
  'coalT6000',
];

const PREVIEW_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.avif'];

function resolveDocumentKey(fileName: string): keyof DocumentTitles | null {
  const lower = fileName.toLowerCase();

  if (lower.includes('ако')) return 'anthraciteAko';
  if (lower.includes('am(13-25)')) return 'anthraciteAm1325';
  if (lower.includes('ас(6-13)')) return 'anthraciteAs613';
  if (lower.includes('аш')) return 'anthraciteAsh06';
  if (lower.includes('тс 6-13')) return 'inspectionTs613';
  if (lower.includes('13-100')) return 'coalT13100';
  if (lower.includes('6 500')) return 'coalT6500';
  if (lower.includes('0-100') || lower.includes('6000')) return 'coalT6000';

  return null;
}

function resolvePreviewHref(pdfDir: string, fileName: string): string | null {
  const baseName = path.parse(fileName).name;

  for (const extension of PREVIEW_EXTENSIONS) {
    const candidateName = `${baseName}${extension}`;
    if (fs.existsSync(path.join(pdfDir, candidateName))) {
      return `/pdf/${encodeURIComponent(candidateName)}`;
    }
  }

  return null;
}

function getDocuments(documentTitles: DocumentTitles): BentoDocument[] {
  const pdfDir = path.join(process.cwd(), 'public', 'pdf');

  try {
    const pdfFiles = fs
      .readdirSync(pdfDir, { withFileTypes: true })
      .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith('.pdf'))
      .map((entry) => entry.name)
      .sort((a, b) => a.localeCompare(b, 'ru'));

    return pdfFiles.map((fileName, index) => {
      const titleKey = resolveDocumentKey(fileName) ?? TITLE_KEY_ORDER[index] ?? null;
      const title = titleKey ? documentTitles[titleKey] : `Document ${index + 1}`;

      return {
        id: fileName,
        title,
        href: `/pdf/${encodeURIComponent(fileName)}`,
        previewHref: resolvePreviewHref(pdfDir, fileName),
        group: titleKey?.startsWith('anthracite') ? 'anthracite' : 'coal',
        order:
          titleKey === 'anthraciteAko'
            ? 0
            : titleKey === 'anthraciteAs613'
              ? 1
              : titleKey === 'anthraciteAsh06'
                ? 2
                : titleKey === 'anthraciteAm1325'
                  ? 3
                  : titleKey === 'inspectionTs613'
                    ? 0
                    : titleKey === 'coalT13100'
                      ? 1
                      : titleKey === 'coalT6500'
                        ? 2
                        : titleKey === 'coalT6000'
                          ? 3
                          : 99,
      };
    });
  } catch {
    return [];
  }
}

export default function BentoDocsGrid({ badge, emptyLabel, downloadLabel, documentTitles }: BentoDocsGridProps) {
  const documents = getDocuments(documentTitles);

  return <BentoDocsGridClient badge={badge} emptyLabel={emptyLabel} downloadLabel={downloadLabel} documents={documents} />;
}
