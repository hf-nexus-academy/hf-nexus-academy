"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/portal/admin/image-upload";

type SettingsValues = {
  whatsappNumber: string;
  contactEmail: string;
  contactPhone: string;
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  tiktokUrl: string;
  twitterUrl: string;
  metaTitle: string;
  metaDescription: string;
  footerTagline: string;
  googleAnalyticsId: string;
  googleVerificationId: string;
};

export function SiteSettingsForm({
  defaultValues,
  initialLogoUrl,
  initialFaviconUrl,
}: {
  defaultValues: SettingsValues;
  initialLogoUrl: string;
  initialFaviconUrl: string;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [logoUrl, setLogoUrl] = React.useState(initialLogoUrl);
  const [faviconUrl, setFaviconUrl] = React.useState(initialFaviconUrl);

  const { register, handleSubmit } = useForm<SettingsValues>({ defaultValues });

  async function onSubmit(values: SettingsValues) {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, logoUrl, faviconUrl }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Could not save settings.");
        return;
      }

      toast.success("Settings saved.");
      router.refresh();
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-10 max-w-2xl">
      <section>
        <h2 className="font-display text-base text-navy-950 mb-4">Contact</h2>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="whatsappNumber">WhatsApp Number (with country code, no symbols)</Label>
            <Input id="whatsappNumber" placeholder="447123456789" {...register("whatsappNumber")} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="contactEmail">Contact Email</Label>
            <Input id="contactEmail" type="email" {...register("contactEmail")} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="contactPhone">Contact Phone (optional)</Label>
            <Input id="contactPhone" {...register("contactPhone")} />
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-display text-base text-navy-950 mb-4">Social Links</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="facebookUrl">Facebook URL</Label>
            <Input id="facebookUrl" {...register("facebookUrl")} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="instagramUrl">Instagram URL</Label>
            <Input id="instagramUrl" {...register("instagramUrl")} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="youtubeUrl">YouTube URL</Label>
            <Input id="youtubeUrl" {...register("youtubeUrl")} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="tiktokUrl">TikTok URL</Label>
            <Input id="tiktokUrl" {...register("tiktokUrl")} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="twitterUrl">X / Twitter URL</Label>
            <Input id="twitterUrl" {...register("twitterUrl")} />
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-display text-base text-navy-950 mb-4">Branding</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          <ImageUpload label="Logo" folder="site" value={logoUrl} onChange={setLogoUrl} aspectClassName="aspect-[3/1]" />
          <ImageUpload
            label="Favicon"
            folder="site"
            value={faviconUrl}
            onChange={setFaviconUrl}
            aspectClassName="aspect-square max-w-[100px]"
          />
        </div>
      </section>

      <section>
        <h2 className="font-display text-base text-navy-950 mb-4">SEO</h2>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="metaTitle">Default Page Title</Label>
            <Input id="metaTitle" {...register("metaTitle")} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="metaDescription">Default Meta Description</Label>
            <Textarea id="metaDescription" {...register("metaDescription")} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="googleAnalyticsId">Google Analytics ID</Label>
            <Input id="googleAnalyticsId" placeholder="G-XXXXXXXXXX" {...register("googleAnalyticsId")} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="googleVerificationId">Google Search Console Verification Code</Label>
            <Input id="googleVerificationId" {...register("googleVerificationId")} />
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-display text-base text-navy-950 mb-4">Footer</h2>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="footerTagline">Footer Tagline</Label>
          <Textarea id="footerTagline" {...register("footerTagline")} />
        </div>
      </section>

      <Button type="submit" disabled={isSubmitting} className="w-fit">
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
        Save Settings
      </Button>
    </form>
  );
}
