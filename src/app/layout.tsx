import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';
import SiteFrame from '@/components/SiteFrame';

const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'IMPEX Coal',
  description: 'IMPEX coal landing page and news feed',
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