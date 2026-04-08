// Root layout file. Sets up the page structure, fonts, and global metadata for the whole app.
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Interactive Calendar | Wall Calendar Component',
  description:
    'A polished, interactive wall calendar component with day range selection, integrated notes, and responsive design.',
  keywords: ['calendar', 'interactive', 'date picker', 'notes', 'react', 'next.js'],
};

import { ThemeProvider, ThemeScript } from '@/contexts/ThemeContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-screen">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
