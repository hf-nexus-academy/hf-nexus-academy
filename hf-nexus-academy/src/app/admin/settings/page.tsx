"use client";

import * as React from "react";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PortalSectionHeader } from "@/components/portal/shared/section-header";

interface Settings {
  whatsappNumber: string;
  contactEmail: string;
  contactPhone: string;
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  tiktokUrl: string;
  twitterUrl: string;
  logoUrl: string;
  metaTitle: string;
  metaDescription: string;
  footerTagline: string;
  googleAnalyticsId: string;
}

function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-ink-300/15 bg-white p-6 mb-4">
      <h2 className="font-display text-base text-navy-950 mb-5 pb-3 border-b border-ink-300/10">{title}</h2>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}

function Field({ label, id, value, onChange, placeholder, type = "text" }: {
  label: string; id: string; value: string;
  onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = React.useState<Settings>({
    whatsappNumber: "", contactEmail: "", contactPhone: "",
    facebookUrl: "", instagramUrl: "", youtubeUrl: "", tiktokUrl: "", twitterUrl: "",
    logoUrl: "", metaTitle: "HF Nexus Academy", metaDescription: "", footerTagline: "",
    googleAnalyticsId: "",
  });
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((d) => { if (d.settings) setSettings(d.settings); })
      .catch(() => toast.error("Could not load settings."))
      .finally(() => setLoading(false));
  }, []);

  function update(key: keyof Settings) {
    return (value: string) => setSettings((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "Could not save."); return; }
      toast.success("Settings saved! Changes will appear on the site within 60 seconds.");
    } catch { toast.error("Something went wrong."); }
    finally { setSaving(false); }
  }

  if (loading) return <p className="text-sm text-ink-500 p-6">Loading settings...</p>;

  return (
    <div>
      <PortalSectionHeader
        title="Site Settings"
        description="Manage all global site settings — no code changes needed."
        action={
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save All Settings
          </Button>
        }
      />

      <SettingsSection title="📱 Contact & WhatsApp">
        <Field label="WhatsApp Number (with country code, e.g. +447911123456)" id="wa" value={settings.whatsappNumber} onChange={update("whatsappNumber")} placeholder="+447911123456" />
        <Field label="Contact Email" id="email" type="email" value={settings.contactEmail} onChange={update("contactEmail")} placeholder="info@hf-nexus.com" />
        <Field label="Contact Phone" id="phone" value={settings.contactPhone} onChange={update("contactPhone")} placeholder="+44 7911 123456" />
      </SettingsSection>

      <SettingsSection title="🌐 Social Media Links">
        <Field label="Facebook URL" id="fb" value={settings.facebookUrl} onChange={update("facebookUrl")} placeholder="https://facebook.com/hfnexus" />
        <Field label="Instagram URL" id="ig" value={settings.instagramUrl} onChange={update("instagramUrl")} placeholder="https://instagram.com/hfnexus" />
        <Field label="YouTube URL" id="yt" value={settings.youtubeUrl} onChange={update("youtubeUrl")} placeholder="https://youtube.com/@hfnexus" />
        <Field label="TikTok URL" id="tt" value={settings.tiktokUrl} onChange={update("tiktokUrl")} placeholder="https://tiktok.com/@hfnexus" />
        <Field label="Twitter/X URL" id="tw" value={settings.twitterUrl} onChange={update("twitterUrl")} placeholder="https://twitter.com/hfnexus" />
      </SettingsSection>

      <SettingsSection title="🔍 SEO & Meta">
        <Field label="Site Title (shown in browser tab)" id="mt" value={settings.metaTitle} onChange={update("metaTitle")} />
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="md">Meta Description</Label>
          <textarea
            id="md"
            value={settings.metaDescription}
            onChange={(e) => update("metaDescription")(e.target.value)}
            rows={3}
            className="rounded-sm border border-ink-300/30 bg-white px-3 py-2 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-gold-500"
            placeholder="Premium online Islamic education..."
          />
        </div>
        <Field label="Footer Tagline" id="ft" value={settings.footerTagline} onChange={update("footerTagline")} placeholder="Authentic Islamic education, delivered worldwide." />
      </SettingsSection>

      <SettingsSection title="📊 Google Analytics">
        <Field label="Google Analytics ID (e.g. G-XXXXXXXXXX)" id="ga" value={settings.googleAnalyticsId} onChange={update("googleAnalyticsId")} placeholder="G-XXXXXXXXXX" />
      </SettingsSection>

      <div className="flex justify-end mt-2">
        <Button onClick={handleSave} disabled={saving} size="lg">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save All Settings
        </Button>
      </div>
    </div>
  );
}
