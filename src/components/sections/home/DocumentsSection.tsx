import fs from 'node:fs';
import path from 'node:path';
import Image from 'next/image';
import styles from './DocumentsSection.module.css';

type DocumentsSectionProps = {
  badge: string;
  emptyLabel: string;
  downloadLabel: string;
  documentTitles: {
    anthraciteAko: string;
    anthraciteAm1325: string;
    anthraciteAs613: string;
    anthraciteAsh06: string;
    inspectionTs613: string;
    coalT13100: string;
    coalT6500: string;
    coalT6000: string;
  };
};

const FILE_TO_DOCUMENT_KEY = {
  '1_10_25 качество АКО (с фабрики) (1).pdf': 'anthraciteAko',
  'AM(13-25)мм.pdf': 'anthraciteAm1325',
  'АС(6-13)мм.pdf': 'anthraciteAs613',
  'АШ (8,0).pdf': 'anthraciteAsh06',
  'ТС 6-13 мм.pdf': 'inspectionTs613',
  'T 13-100 mm.pdf': 'coalT13100',
  'T  6 500 ККАЛ (1).pdf': 'coalT6500',
  'Т(0-100)мм 6000 Ккалкг.pdf .pdf': 'coalT6000',
} as const;

function getDocuments(documentTitles: DocumentsSectionProps['documentTitles']) {
  const pdfDir = path.join(process.cwd(), 'public', 'pdf');

  try {
    const files = fs
      .readdirSync(pdfDir, { withFileTypes: true })
      .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith('.pdf'))
      .map((entry) => entry.name)
      .sort((a, b) => a.localeCompare(b, 'ru'));

    return files.map((fileName, index) => {
      const mappedKey = FILE_TO_DOCUMENT_KEY[fileName as keyof typeof FILE_TO_DOCUMENT_KEY];

      return {
        id: fileName,
        title: mappedKey ? documentTitles[mappedKey] : `Document ${index + 1}`,
        href: `/pdf/${encodeURIComponent(fileName)}`,
      };
    });
  } catch {
    return [];
  }
}

export default function DocumentsSection({ badge, emptyLabel, downloadLabel, documentTitles }: DocumentsSectionProps) {
  const documents = getDocuments(documentTitles);

  return (
    <section className={styles.root} aria-label={badge}>
      <div className={styles.inner}>
        <span className={styles.badge}>
          <Image src="/icons/check.svg" alt="" width={14} height={14} className={styles.badgeIcon} aria-hidden />
          {badge}
        </span>
        <div className={styles.listCard}>
          {documents.length > 0 ? (
            <ul className={styles.list}>
              {documents.map((document) => (
                <li key={document.id} className={styles.item}>
                  <a href={document.href} target="_blank" rel="noopener noreferrer" className={styles.documentLink}>
                    <span className={styles.fileIconWrap}>
                      <Image src="/icons/file-pdf.svg" alt="" width={20} height={20} className={styles.fileIcon} aria-hidden />
                    </span>
                    <span className={styles.documentTitle}>{document.title}</span>
                  </a>
                  <a
                    href={document.href}
                    download
                    className={styles.downloadLink}
                    aria-label={`${document.title}. ${downloadLabel}`}
                    title={downloadLabel}
                  >
                    <Image src="/icons/download.svg" alt="" width={18} height={18} className={styles.downloadIcon} aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.empty}>{emptyLabel}</p>
          )}
        </div>
      </div>
    </section>
  );
}
