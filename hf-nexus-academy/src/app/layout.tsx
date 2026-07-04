import type { Metadata } from "next";

import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { WhatsAppFloatingButton } from "@/components/layout/whatsapp-button";
import { AuthProvider } from "@/components/providers/auth-provider";
import { Toaster } from "@/components/ui/toaster";
import { getSiteSettings } from "@/lib/data/public";

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
    "online Quran classes", "online Hadith classes", "online Fiqh classes",
    "Arabic language classes", "Islamic studies online", "Islamic academy",
    "learn Islam online", "Islamic learning platform", "Quran teacher online",
  ],
  authors: [{ name: "HF Nexus Academy" }],
  openGraph: {
    type: "website", url: APP_URL, siteName: "HF Nexus Academy",
    title: "HF Nexus Academy — Online Quran, Hadith, Fiqh & Arabic Classes",
    description: "Learn authentic Islamic knowledge through live online classes taught by qualified scholars.",
    images: [{ url: "/images/og-default.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image", title: "HF Nexus Academy",
    description: "Learn authentic Islamic knowledge through live online classes taught by qualified scholars.",
  },
  robots: { index: true, follow: true },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSiteSettings();

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppFloatingButton number={settings.whatsappNumber} />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
