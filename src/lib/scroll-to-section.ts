export const HEADER_OFFSET_DESKTOP = 108;
export const HEADER_OFFSET_MOBILE = 96;

// Tune per section if you need exact pixel-perfect positioning.
export const SECTION_TUNE: Record<string, number> = {
  top: 0,
  'next-block': 0,
  about: 0,
  segments: 0,
  products: 0,
};

function getHeaderOffset() {
  if (typeof window === 'undefined') {
    return HEADER_OFFSET_DESKTOP;
  }

  return window.innerWidth <= 800 ? HEADER_OFFSET_MOBILE : HEADER_OFFSET_DESKTOP;
}

export function scrollToSection(id: string, behavior: ScrollBehavior = 'smooth') {
  if (typeof window === 'undefined') {
    return;
  }

  const normalizedId = id.replace(/^#/, '');

  if (!normalizedId || normalizedId === 'top') {
    window.scrollTo({ top: 0, left: 0, behavior });
    return;
  }

  const target = document.getElementById(normalizedId);
  if (!target) {
    return;
  }

  const tune = SECTION_TUNE[normalizedId] ?? 0;
  const top = target.getBoundingClientRect().top + window.scrollY - getHeaderOffset() + tune;

  window.scrollTo({
    top: Math.max(0, top),
    left: 0,
    behavior,
  });
}
