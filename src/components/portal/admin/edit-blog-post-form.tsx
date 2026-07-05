"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { ImageUpload } from "@/components/portal/admin/image-upload";

const schema = z.object({
  title: z.string().min(2, "Enter a title."),
  excerpt: z.string().min(10, "Add a short excerpt."),
  content: z.string().min(20, "Add the full content."),
  status: z.string().min(1),
});

type Values = z.infer<typeof schema>;

export function EditBlogPostForm({
  postId,
  defaultValues,
  initialCoverImageUrl,
}: {
  postId: string;
  defaultValues: Values;
  initialCoverImageUrl: string | null;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [coverImageUrl, setCoverImageUrl] = React.useState(initialCoverImageUrl ?? "");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Values>({ resolver: zodResolver(schema), defaultValues });

  async function onSubmit(values: Values) {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/blog/${postId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, coverImageUrl: coverImageUrl || null }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Could not update post.");
        return;
      }

      toast.success("Blog post updated.");
      router.refresh();
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 max-w-2xl">
      <ImageUpload label="Cover Image" folder="blog" value={coverImageUrl} onChange={setCoverImageUrl} />

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="title">Title</Label>
        <Input id="title" error={!!errors.title} {...register("title")} />
        {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea id="excerpt" error={!!errors.excerpt} {...register("excerpt")} />
        {errors.excerpt && <p className="text-xs text-destructive">{errors.excerpt.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="content">Content (HTML supported)</Label>
        <Textarea id="content" className="min-h-[240px]" error={!!errors.content} {...register("content")} />
        {errors.content && <p className="text-xs text-destructive">{errors.content.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5 max-w-xs">
        <Label htmlFor="status">Status</Label>
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="PUBLISHED">Published</SelectItem>
                <SelectItem value="ARCHIVED">Archived</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-fit mt-2">
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
        Save Changes
      </Button>
    </form>
  );
}
