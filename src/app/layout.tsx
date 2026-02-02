import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GlobalMouse } from "@/components/GlobalMouse";
import { Providers } from "@/components/Providers";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["400", "600", "700", "900"],
  display: 'swap',
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL('https://filedash.vercel.app'),
  alternates: {
    canonical: '/',
  },
  title: "FileDash | The Fastest Way to Share Large Files",
  description: "Share files up to 100GB in seconds. Encrypted, free, and designed for speed. The ultimate WeTransfer alternative.",
  keywords: ["file sharing", "fast file transfer", "send large files", "free file upload", "100GB free", "secure transfer", "FileDash", "encrypted sharing"],
  authors: [{ name: "FileDash Systems" }],
  creator: "FileDash",
  publisher: "FileDash",
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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://filedash.vercel.app",
    title: "FileDash | Send 100GB for Free",
    description: "Share files up to 100GB in seconds. Encrypted, free, and designed for speed.",
    siteName: "FileDash",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: 'FileDash Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "FileDash | Send 100GB for Free",
    description: "The modern WeTransfer alternative. Encrypted. Fast. Beautiful.",
    // images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  verification: {
    google: 'RWeHzgX7mrKgOAemL97yZrSJuacj4_DYTFt-a-qp594',
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

import { auth } from "@/auth";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en" className="scroll-smooth antialiased">
      <body className={`${inter.variable} ${outfit.variable} font-sans relative min-h-screen selection:bg-secure/10`}>
        <Providers>
          <Navbar session={session} />
          {children}
          <Footer />
          <GlobalMouse />
        </Providers>
      </body>
    </html>
  );
}
