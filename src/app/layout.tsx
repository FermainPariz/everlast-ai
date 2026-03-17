import type { Metadata } from 'next';
import { Outfit, DM_Mono } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Everlast AI — Voice RAG Assistant',
  description: 'KI-gestützter Wissensassistent mit Sprachsteuerung — powered by RAG, Next.js & Claude',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className={`${outfit.variable} ${dmMono.variable}`}>{children}</body>
    </html>
  );
}
