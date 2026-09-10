import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/providers';
import '@mantine/core/styles.css';
import '@/styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
});

export const metadata: Metadata = {
  title: 'Build Better — Construction Project Management',
  description: 'Modern construction project management platform for managing projects, documentation, RFIs, submittals, issues, site photos, daily logs, and project insights.',
  keywords: ['construction', 'project management', 'RFIs', 'submittals', 'daily logs', 'document control'],
  authors: [{ name: 'Build Better' }],
  creator: 'Build Better',
  publisher: 'Build Better',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://buildbetter.app',
    title: 'Build Better — Construction Project Management',
    description: 'Modern construction project management platform',
    siteName: 'Build Better',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Build Better — Construction Project Management',
    description: 'Modern construction project management platform',
  },
};

export const viewport: Viewport = {
  themeColor: '#1F3A4E',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,100..900;1,9..144,100..900&family=Space+Grotesk:wght@300..700&family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600&display=swap" 
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-background text-text">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}