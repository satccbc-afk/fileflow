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
  metadataBase: new URL('https://fileflow.io'),
  alternates: {
    canonical: '/',
  },
  title: "Fileflow | The Best Free Date Transfer Alternative",
  description: "Send large files up to 100GB for free. The secure, fast, and beautiful WeTransfer alternative. No ads, just seamless file sharing.",
  keywords: ["file sharing", "wetransfer alternative", "send large files", "free file upload", "100GB free", "secure transfer", "Fileflow", "encrypted sharing"],
  authors: [{ name: "Fileflow Systems" }],
  creator: "Fileflow",
  publisher: "Fileflow",
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
    title: "Fileflow | Send 100GB for Free",
    description: "The modern, secure alternative to WeTransfer. Share files with style and speed.",
    url: "https://fileflow.io",
    siteName: "Fileflow",
    images: [
      {
        url: '/og-image.png', // User needs to ensure this exists or I will create a placeholder
        width: 1200,
        height: 630,
        alt: 'Fileflow Preview',
      },
    ],
    locale: 'en_US',
    type: "website",
  },
  twitter: {
    card: 'summary_large_image',
    title: "Fileflow | Send 100GB for Free",
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
