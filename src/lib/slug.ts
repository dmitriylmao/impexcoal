const CYRILLIC_MAP: Record<string, string> = {
  а: 'a',
  б: 'b',
  в: 'v',
  г: 'g',
  д: 'd',
  е: 'e',
  ё: 'e',
  ж: 'zh',
  з: 'z',
  и: 'i',
  й: 'y',
  к: 'k',
  л: 'l',
  м: 'm',
  н: 'n',
  о: 'o',
  п: 'p',
  р: 'r',
  с: 's',
  т: 't',
  у: 'u',
  ф: 'f',
  х: 'h',
  ц: 'ts',
  ч: 'ch',
  ш: 'sh',
  щ: 'sch',
  ъ: '',
  ы: 'y',
  ь: '',
  э: 'e',
  ю: 'yu',
  я: 'ya',
};

const LATIN_EXT_MAP: Record<string, string> = {
  ğ: 'g',
  ü: 'u',
  ş: 's',
  ı: 'i',
  ö: 'o',
  ç: 'c',
};

function transliterate(value: string): string {
  return value
    .toLowerCase()
    .split('')
    .map((char) => CYRILLIC_MAP[char] ?? LATIN_EXT_MAP[char] ?? char)
    .join('');
}

export function slugify(value: string): string {
  return transliterate(value)
    .replace(/['"`]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

type ExistsFn = (slug: string) => Promise<boolean>;

export async function generateUniqueSlug(baseValue: string, exists: ExistsFn): Promise<string> {
  const base = slugify(baseValue) || 'item';

  let candidate = base;
  let counter = 2;

  while (await exists(candidate)) {
    candidate = `${base}-${counter}`;
    counter += 1;
  }

  return candidate;
}
