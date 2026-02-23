import 'server-only';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { timingSafeEqual } from 'node:crypto';
import {
  ADMIN_SESSION_COOKIE_NAME,
  ADMIN_SESSION_TTL_SECONDS,
  createAdminSessionToken,
  verifyAdminSessionToken,
} from '@/lib/admin-session';

const DEV_DEFAULT_USERNAME = 'admin';
const DEV_DEFAULT_PASSWORD = 'admin';

function getAdminCredentials() {
  return {
    username: process.env.ADMIN_USERNAME ?? DEV_DEFAULT_USERNAME,
    password: process.env.ADMIN_PASSWORD ?? DEV_DEFAULT_PASSWORD,
  };
}

function safeStringEqual(a: string, b: string): boolean {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);

  if (aBuffer.length !== bBuffer.length) {
    return false;
  }

  return timingSafeEqual(aBuffer, bBuffer);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE_NAME)?.value;
  return verifyAdminSessionToken(token);
}

export async function requireAdminAuthOrRedirect(): Promise<void> {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    redirect('/admin/login');
  }
}

export async function signInAdmin(username: string, password: string): Promise<boolean> {
  const credentials = getAdminCredentials();

  if (!safeStringEqual(username, credentials.username) || !safeStringEqual(password, credentials.password)) {
    return false;
  }

  const cookieStore = await cookies();
  const token = await createAdminSessionToken(username);

  cookieStore.set({
    name: ADMIN_SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: ADMIN_SESSION_TTL_SECONDS,
  });

  return true;
}

export async function signOutAdmin(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE_NAME);
}