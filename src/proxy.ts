import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAdminSessionToken } from '@/lib/admin-session';
import { i18n } from '@/i18n/config';

const CIS_COUNTRIES = new Set([
  'RU',
  'BY',
  'KZ',
  'KG',
  'TJ',
  'TM',
  'UZ',
  'AM',
  'AZ',
  'MD',
]);

function resolveLocaleByCountry(country: string | null): (typeof i18n.locales)[number] {
  if (!country) {
    return i18n.defaultLocale;
  }

  const normalized = country.toUpperCase();

  if (normalized === 'TR') {
    return 'tr';
  }

  if (CIS_COUNTRIES.has(normalized)) {
    return 'ru';
  }

  return 'en';
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/api') || pathname.startsWith('/_next') || pathname.match(/\.[^/]+$/)) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/admin')) {
    const isLoginRoute = pathname === '/admin/login';
    const sessionToken = request.cookies.get('impexcoal_admin_session')?.value;
    const authenticated = await verifyAdminSessionToken(sessionToken);

    if (!authenticated && !isLoginRoute) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    if (authenticated && isLoginRoute) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }

    return NextResponse.next();
  }

  const pathnameHasLocale = i18n.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  const country = request.headers.get('x-vercel-ip-country');
  const locale = resolveLocaleByCountry(country);

  const newPath = `/${locale}${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(new URL(newPath, request.url));
}

export const config = {
  matcher: ['/((?!_next|_vercel|api|.*\\..*).*)'],
};
