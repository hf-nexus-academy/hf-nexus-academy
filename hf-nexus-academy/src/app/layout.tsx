import type { Metadata } from "next";
import Script from "next/script";

import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { WhatsAppFloatingButton } from "@/components/layout/whatsapp-button";
import { AuthProvider } from "@/components/providers/auth-provider";
import { Toaster } from "@/components/ui/toaster";
import { getSiteSettings } from "@/lib/data/admin";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://hf-nexus.com";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    metadataBase: new URL(APP_URL),
    title: {
      default: settings.metaTitle || "HF Nexus Academy — Online Quran, Hadith, Fiqh & Arabic Classes",
      template: "%s | HF Nexus Academy",
    },
    description:
      settings.metaDescription ||
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
      title: settings.metaTitle || "HF Nexus Academy — Online Quran, Hadith, Fiqh & Arabic Classes",
      description:
        settings.metaDescription || "Learn authentic Islamic knowledge through live online classes taught by qualified scholars.",
      images: [{ url: "/images/og-default.jpg", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: "HF Nexus Academy",
      description:
        settings.metaDescription || "Learn authentic Islamic knowledge through live online classes taught by qualified scholars.",
    },
    robots: {
      index: true,
      follow: true,
    },
    ...(settings.googleVerificationId
      ? { verification: { google: settings.googleVerificationId } }
      : {}),
    icons: settings.faviconUrl ? { icon: settings.faviconUrl } : undefined,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSiteSettings();

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        {settings.googleAnalyticsId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${settings.googleAnalyticsId}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${settings.googleAnalyticsId}');
              `}
            </Script>
          </>
        )}
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
