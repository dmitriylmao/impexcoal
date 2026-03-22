import type { Metadata, Viewport } from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';
import SiteFrame from '@/components/SiteFrame';
import { DEFAULT_OG_DESCRIPTION, DEFAULT_OG_IMAGE, DEFAULT_OG_TITLE, SITE_URL } from '@/lib/seo';

const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: SITE_URL,
  title: 'TD "IMPEKS"',
  description: DEFAULT_OG_DESCRIPTION,
  icons: {
    icon: [{ url: '/favicon.ico?v=2', sizes: 'any' }],
    apple: [{ url: '/logo.png', type: 'image/png' }],
    shortcut: [{ url: '/favicon.ico?v=2' }],
  },
  manifest: '/manifest.webmanifest',
  openGraph: {
    type: 'website',
    siteName: DEFAULT_OG_TITLE,
    title: DEFAULT_OG_TITLE,
    description: DEFAULT_OG_DESCRIPTION,
    url: SITE_URL,
    images: [
      {
        url: new URL(DEFAULT_OG_IMAGE, SITE_URL),
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: DEFAULT_OG_TITLE,
    description: DEFAULT_OG_DESCRIPTION,
    images: [new URL(DEFAULT_OG_IMAGE, SITE_URL)],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${manrope.variable} app-body`}>
        <SiteFrame>{children}</SiteFrame>
      </body>
    </html>
  );
}
