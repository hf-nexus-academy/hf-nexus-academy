import { getSiteSettings } from "@/lib/data/admin";
import { PortalSectionHeader } from "@/components/portal/shared/section-header";
import { SiteSettingsForm } from "@/components/portal/admin/site-settings-form";

export const metadata = { title: "Site Settings" };

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <PortalSectionHeader
        title="Site Settings"
        description="Contact details, social links, branding, and SEO defaults used across the public site."
      />

      <SiteSettingsForm
        initialLogoUrl={settings.logoUrl}
        initialFaviconUrl={settings.faviconUrl}
        defaultValues={{
          whatsappNumber: settings.whatsappNumber,
          contactEmail: settings.contactEmail,
          contactPhone: settings.contactPhone,
          facebookUrl: settings.facebookUrl,
          instagramUrl: settings.instagramUrl,
          youtubeUrl: settings.youtubeUrl,
          tiktokUrl: settings.tiktokUrl,
          twitterUrl: settings.twitterUrl,
          metaTitle: settings.metaTitle,
          metaDescription: settings.metaDescription,
          footerTagline: settings.footerTagline,
          googleAnalyticsId: settings.googleAnalyticsId,
          googleVerificationId: settings.googleVerificationId,
        }}
      />
    </div>
  );
}
