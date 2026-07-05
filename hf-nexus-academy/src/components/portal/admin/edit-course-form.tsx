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
import { Switch } from "@/components/ui/switch";
import { ImageUpload } from "@/components/portal/admin/image-upload";

const schema = z.object({
  title: z.string().min(2, "Enter a course title."),
  subtitle: z.string().optional(),
  description: z.string().min(10, "Add a description (10+ characters)."),
});

type FormValues = z.infer<typeof schema>;

export function EditCourseForm({
  courseId,
  defaultValues,
  initialCoverImageUrl,
  initialIsFeatured,
  initialEnrollmentOpen,
}: {
  courseId: string;
  defaultValues: { title: string; subtitle: string; description: string };
  initialCoverImageUrl: string | null;
  initialIsFeatured: boolean;
  initialEnrollmentOpen: boolean;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [coverImageUrl, setCoverImageUrl] = React.useState(initialCoverImageUrl ?? "");
  const [isFeatured, setIsFeatured] = React.useState(initialIsFeatured);
  const [enrollmentOpen, setEnrollmentOpen] = React.useState(initialEnrollmentOpen);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues });

  async function persist(patch: Record<string, unknown>) {
    const res = await fetch(`/api/admin/courses/${courseId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error || "Could not update course.");
      return false;
    }
    return true;
  }

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    try {
      const ok = await persist({ ...values, coverImageUrl: coverImageUrl || null });
      if (ok) {
        toast.success("Course updated.");
        router.refresh();
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleFeaturedChange(checked: boolean) {
    setIsFeatured(checked);
    const ok = await persist({ isFeatured: checked });
    if (ok) {
      toast.success(checked ? "Course featured on home page." : "Course removed from featured.");
      router.refresh();
    } else {
      setIsFeatured(!checked);
    }
  }

  async function handleEnrollmentChange(checked: boolean) {
    setEnrollmentOpen(checked);
    const ok = await persist({ enrollmentOpen: checked });
    if (ok) {
      toast.success(checked ? "Enrollment opened." : "Enrollment closed.");
      router.refresh();
    } else {
      setEnrollmentOpen(!checked);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <ImageUpload label="Cover Image" folder="courses" value={coverImageUrl} onChange={setCoverImageUrl} />

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="title">Title</Label>
          <Input id="title" error={!!errors.title} {...register("title")} />
          {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="subtitle">Subtitle</Label>
          <Input id="subtitle" {...register("subtitle")} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            className="min-h-[140px]"
            error={!!errors.description}
            {...register("description")}
          />
          {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-fit mt-2">
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </form>

      <div className="flex flex-wrap items-center gap-6 border-t border-ink-300/10 pt-4">
        <div className="flex items-center gap-2">
          <Switch checked={isFeatured} onCheckedChange={handleFeaturedChange} aria-label="Featured" />
          <span className="text-xs text-ink-500">{isFeatured ? "Featured on home page" : "Not featured"}</span>
        </div>
        <div className="flex items-center gap-2">
          <Switch checked={enrollmentOpen} onCheckedChange={handleEnrollmentChange} aria-label="Enrollment open" />
          <span className="text-xs text-ink-500">{enrollmentOpen ? "Enrollment open" : "Enrollment closed"}</span>
        </div>
      </div>
    </div>
  );
}
