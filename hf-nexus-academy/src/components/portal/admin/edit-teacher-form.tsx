"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/portal/admin/image-upload";

const schema = z.object({
  title: z.string().max(50).optional(),
  bio: z.string().min(10, "Add a short biography (10+ characters)."),
  specializations: z.string().min(1, "List at least one specialization."),
  experienceYears: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function EditTeacherForm({
  teacherId,
  defaultValues,
  initialPhotoUrl,
}: {
  teacherId: string;
  defaultValues: {
    title: string;
    bio: string;
    specializations: string[];
    experienceYears: number | null;
  };
  initialPhotoUrl: string | null;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [photoUrl, setPhotoUrl] = React.useState(initialPhotoUrl ?? "");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: defaultValues.title,
      bio: defaultValues.bio,
      specializations: defaultValues.specializations.join(", "),
      experienceYears: defaultValues.experienceYears?.toString() ?? "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/teachers/${teacherId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: values.title,
          bio: values.bio,
          specializations: values.specializations.split(",").map((s) => s.trim()).filter(Boolean),
          experienceYears: values.experienceYears ? Number(values.experienceYears) : null,
          photoUrl: photoUrl || null,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Could not update teacher.");
        return;
      }

      toast.success("Teacher profile updated.");
      router.refresh();
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <ImageUpload
        label="Profile Photo"
        folder="teachers"
        value={photoUrl}
        onChange={setPhotoUrl}
        aspectClassName="aspect-square max-w-[160px]"
      />

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="title">Title (e.g. Mufti)</Label>
        <Input id="title" {...register("title")} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="bio">Biography</Label>
        <Textarea id="bio" className="min-h-[140px]" error={!!errors.bio} {...register("bio")} />
        {errors.bio && <p className="text-xs text-destructive">{errors.bio.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="specializations">Specializations (comma-separated)</Label>
        <Input id="specializations" error={!!errors.specializations} {...register("specializations")} />
        {errors.specializations && <p className="text-xs text-destructive">{errors.specializations.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5 max-w-xs">
        <Label htmlFor="experienceYears">Years of Experience</Label>
        <Input id="experienceYears" type="number" min={0} {...register("experienceYears")} />
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-fit mt-2">
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
        Save Profile
      </Button>
    </form>
  );
}
