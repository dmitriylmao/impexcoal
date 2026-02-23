const DEV_FALLBACK_SECRET = 'change-this-dev-admin-session-secret-32';

export const ADMIN_SESSION_COOKIE_NAME = 'impexcoal_admin_session';
export const ADMIN_SESSION_TTL_SECONDS = 60 * 60 * 8;

type AdminSessionPayload = {
  sub: string;
  exp: number;
};

function getAdminSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (secret && secret.length >= 32) {
    return secret;
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('ADMIN_SESSION_SECRET must be set and at least 32 chars in production.');
  }

  return DEV_FALLBACK_SECRET;
}

function encodeBase64Url(input: Uint8Array): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(input).toString('base64url');
  }

  let binary = '';
  input.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function decodeBase64Url(input: string): Uint8Array {
  if (typeof Buffer !== 'undefined') {
    return new Uint8Array(Buffer.from(input, 'base64url'));
  }

  const padded = input.padEnd(Math.ceil(input.length / 4) * 4, '=');
  const binary = atob(padded.replace(/-/g, '+').replace(/_/g, '/'));
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes;
}

function safeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a[i] ^ b[i];
  }

  return diff === 0;
}

async function sign(message: string, secret: string): Promise<string> {
  const keyData = new TextEncoder().encode(secret);
  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    {
      name: 'HMAC',
      hash: 'SHA-256',
    },
    false,
    ['sign'],
  );

  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message));
  return encodeBase64Url(new Uint8Array(signature));
}

export async function createAdminSessionToken(subject: string): Promise<string> {
  const payload: AdminSessionPayload = {
    sub: subject,
    exp: Math.floor(Date.now() / 1000) + ADMIN_SESSION_TTL_SECONDS,
  };

  const payloadEncoded = encodeBase64Url(new TextEncoder().encode(JSON.stringify(payload)));
  const signature = await sign(payloadEncoded, getAdminSessionSecret());

  return `${payloadEncoded}.${signature}`;
}

export async function verifyAdminSessionToken(token: string | undefined): Promise<boolean> {
  if (!token || token.length > 2000) {
    return false;
  }

  const [payloadEncoded, signature] = token.split('.');
  if (!payloadEncoded || !signature) {
    return false;
  }

  let payload: AdminSessionPayload;
  try {
    payload = JSON.parse(new TextDecoder().decode(decodeBase64Url(payloadEncoded))) as AdminSessionPayload;
  } catch {
    return false;
  }

  if (!payload?.sub || !payload?.exp || payload.exp <= Math.floor(Date.now() / 1000)) {
    return false;
  }

  const expectedSignature = await sign(payloadEncoded, getAdminSessionSecret());

  return safeEqual(decodeBase64Url(signature), decodeBase64Url(expectedSignature));
}