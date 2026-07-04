"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  teacherId: string;
  defaultValues: {
    name: string;
    title: string;
    bio: string;
    specializations: string[];
    experienceYears: number | null;
    photoUrl: string | null;
    slug: string;
  };
}

export function TeacherEditForm({ teacherId, defaultValues }: Props) {
  const router = useRouter();
  const [name, setName] = React.useState(defaultValues.name);
  const [title, setTitle] = React.useState(defaultValues.title ?? "");
  const [bio, setBio] = React.useState(defaultValues.bio);
  const [specializations, setSpecializations] = React.useState(defaultValues.specializations.join(", "));
  const [experienceYears, setExperienceYears] = React.useState(String(defaultValues.experienceYears ?? ""));
  const [photoUrl, setPhotoUrl] = React.useState(defaultValues.photoUrl ?? "");
  const [slug, setSlug] = React.useState(defaultValues.slug);
  const [saving, setSaving] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/teachers/${teacherId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          title,
          bio,
          specializations: specializations.split(",").map((s) => s.trim()).filter(Boolean),
          experienceYears: experienceYears ? parseInt(experienceYears) : null,
          photoUrl: photoUrl || null,
          slug,
        }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "Could not save."); return; }
      toast.success("Teacher profile updated.");
      router.refresh();
    } catch { toast.error("Something went wrong."); }
    finally { setSaving(false); }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label>Full Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Title (e.g. Mufti, Sheikh, Ustadh)</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Mufti" />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Biography</Label>
        <textarea value={bio} onChange={(e) => setBio(e.target.value)} required rows={4}
          className="rounded-sm border border-ink-300/30 bg-white px-3 py-2 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-gold-500"
          placeholder="Write a short biography..." />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Specializations (comma-separated)</Label>
        <Input value={specializations} onChange={(e) => setSpecializations(e.target.value)}
          placeholder="Fiqh, Arabic Language, Aqeedah" />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label>Years of Teaching Experience</Label>
          <Input type="number" min={0} value={experienceYears} onChange={(e) => setExperienceYears(e.target.value)} placeholder="12" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>URL Slug (for /teachers/[slug])</Label>
          <Input value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))} required />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Photo URL</Label>
        <Input value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)}
          placeholder="https://..." type="url" />
        <p className="text-xs text-ink-300">Paste a direct image URL (e.g. from Cloudinary, Imgur, or your hosting).</p>
      </div>

      <Button type="submit" disabled={saving} className="w-fit">
        {saving && <Loader2 className="h-4 w-4 animate-spin" />}
        Save Profile
      </Button>
    </form>
  );
}
