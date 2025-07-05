import "../styles/globals.css";
import { Metadata } from "next";
import { Outfit } from "next/font/google";
//import type { Viewport } from 'next'
 

const outfit = Outfit({
  variable: "--font-outfit-sans",
  subsets: ["latin"],
});

// export const viewport: Viewport = {
//   themeColor: '#16335c',
// }

export const metadata: Metadata = {
  title: "Xtopay Checkout",
  description: "A modern checkout experience for Xtopay",
  openGraph: {
    title: "Xtopay Checkout",
    description: "A modern checkout experience for Xtopay",
    url: "https://checkout.Xtopay.co",
    siteName: "Xtopay Checkout",
    images: [
      {
        url: "https://checkout.Xtopay.co/og-image.png",
        width: 1200,
        height: 630,
        alt: "Xtopay Checkout",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Xtopay Checkout",
    description: "A modern checkout experience for Xtopay",
    images: ["https://checkout.Xtopay.co/og-image.png"],
  },
  manifest: "/manifest.json",
  // themeColor: "#16335c",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    noarchive: false,
    noimageindex: false,
    nosnippet: false,
   
  },
  keywords: ["Xtopay", "Checkout", "Payment", "E-commerce"],
  authors: [
    {
      name: "Xtopay",
      url: "https://Xtopay.co",
    },
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} flex flex-col min-h-screen font-sans`}
      >
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
