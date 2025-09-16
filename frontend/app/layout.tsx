import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from './providers';
import { Toaster } from 'react-hot-toast';

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Story Swap | Hyperlocal Storytelling Platform",
  description: "Discover and share stories from your city. Unlock fascinating local tales by contributing your own experiences.",
  keywords: "storytelling, local stories, community, swap stories, hyperlocal, cultural exchange",
  authors: [{ name: "Story Swap Team" }],
  creator: "Story Swap",
  publisher: "Story Swap",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    title: "Story Swap | Hyperlocal Storytelling Platform",
    description: "Discover and share stories from your city. Unlock fascinating local tales by contributing your own experiences.",
    url: '/',
    siteName: 'Story Swap',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Story Swap - Hyperlocal Storytelling Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Story Swap | Hyperlocal Storytelling Platform",
    description: "Discover and share stories from your city. Unlock fascinating local tales by contributing your own experiences.",
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased bg-background text-foreground">
        <Providers>
          {children}
          <Toaster 
            position="bottom-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'rgba(0, 0, 0, 0.8)',
                color: '#fff',
                borderRadius: '8px',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
