import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Interactive Calendar | Wall Calendar Component',
  description:
    'A polished, interactive wall calendar component with day range selection, integrated notes, and responsive design.',
  keywords: ['calendar', 'interactive', 'date picker', 'notes', 'react', 'next.js'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
