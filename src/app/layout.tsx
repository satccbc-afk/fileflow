import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import "@uploadthing/react/styles.css";
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
  metadataBase: new URL('https://mydroptransfer.vercel.app'),
  alternates: {
    canonical: '/',
  },
  title: "MyDrop Transfer | The Best Free Data Transfer Alternative",
  description: "Share files up to 100GB for free. End-to-end encrypted, password protected, and lightning fast. No account required.",
  keywords: ["file sharing", "wetransfer alternative", "send large files", "free file upload", "100GB free", "secure transfer", "MyDrop Transfer", "encrypted sharing"],
  authors: [{ name: "MyDrop Transfer" }],
  creator: "MyDrop Transfer",
  publisher: "MyDrop Transfer",
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
    url: "https://mydroptransfer.vercel.app",
    title: "MyDrop Transfer | Send 100GB for Free",
    description: "Share files up to 100GB for free. End-to-end encrypted, password protected, and lightning fast. No account required.",
    siteName: "MyDrop Transfer",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: 'MyDrop Transfer Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "MyDrop Transfer | Send 100GB for Free",
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
          <script src="https://checkout.razorpay.com/v1/checkout.js" async />
        </Providers>

      </body>
    </html>
  );
}
