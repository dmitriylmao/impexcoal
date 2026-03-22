import type { Metadata, Viewport } from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';
import SiteFrame from '@/components/SiteFrame';

const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'TD "IMPEKS"',
  description: 'International anthracite and thermal coal supply',
  icons: {
    icon: [{ url: '/favicon.ico?v=2', sizes: 'any' }],
    apple: [{ url: '/logo.png', type: 'image/png' }],
    shortcut: [{ url: '/favicon.ico?v=2' }],
  },
  manifest: '/manifest.webmanifest',
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
