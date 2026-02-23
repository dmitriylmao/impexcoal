import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { i18n } from '@/i18n/config';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.match(/\.[^/]+$/)
  ) {
    return NextResponse.next();
  }

  const pathnameHasLocale = i18n.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  const newPath = `/${i18n.defaultLocale}${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(new URL(newPath, request.url));
}

export const config = {
  matcher: ['/((?!_next|_vercel|api|admin|.*\\..*).*)'],
};
