import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";

import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { WhatsAppFloatingButton } from "@/components/layout/whatsapp-button";
import { AuthProvider } from "@/components/providers/auth-provider";
import { Toaster } from "@/components/ui/toaster";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  weight: ["400", "500"],
  display: "swap",
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://hf-nexus.com";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "HF Nexus Academy — Online Quran, Hadith, Fiqh & Arabic Classes",
    template: "%s | HF Nexus Academy",
  },
  description:
    "Learn authentic Islamic knowledge through live online classes in Quran, Hadith, Fiqh, Arabic, and classical Islamic sciences, taught by qualified scholars. Worldwide enrollment open.",
  keywords: [
    "online Quran classes",
    "online Hadith classes",
    "online Fiqh classes",
    "Arabic language classes",
    "Islamic studies online",
    "Islamic academy",
    "learn Islam online",
    "Islamic learning platform",
    "Quran teacher online",
  ],
  authors: [{ name: "HF Nexus Academy" }],
  openGraph: {
    type: "website",
    url: APP_URL,
    siteName: "HF Nexus Academy",
    title: "HF Nexus Academy — Online Quran, Hadith, Fiqh & Arabic Classes",
    description:
      "Learn authentic Islamic knowledge through live online classes taught by qualified scholars.",
    images: [{ url: "/images/og-default.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "HF Nexus Academy",
    description:
      "Learn authentic Islamic knowledge through live online classes taught by qualified scholars.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="flex min-h-screen flex-col">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppFloatingButton />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
