"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const schema = z.object({
  courseId: z.string().min(1, "Select a course."),
  title: z.string().min(2, "Enter a lesson title."),
  description: z.string().optional(),
  videoUrl: z.string().url("Enter a valid URL.").optional().or(z.literal("")),
  resourceUrl: z.string().url("Enter a valid URL.").optional().or(z.literal("")),
  durationMins: z.string().optional(),
});

type Values = z.infer<typeof schema>;

export function CreateLessonDialog({ courses }: { courses: { id: string; title: string }[] }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<Values>({ resolver: zodResolver(schema) });

  async function onSubmit(values: Values) {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/teacher/lessons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Could not create lesson.");
        return;
      }

      toast.success("Lesson created.");
      setOpen(false);
      reset();
      router.refresh();
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="gold">
          <Plus className="h-4 w-4" /> Upload Lesson
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Lesson</DialogTitle>
          <DialogDescription>Add a new lesson to one of your courses.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="courseId">Course</Label>
            <Controller
              control={control}
              name="courseId"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id="courseId">
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.courseId && <p className="text-xs text-destructive">{errors.courseId.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="title">Lesson Title</Label>
            <Input id="title" error={!!errors.title} {...register("title")} />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea id="description" {...register("description")} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="videoUrl">Video URL (optional)</Label>
            <Input id="videoUrl" placeholder="https://..." error={!!errors.videoUrl} {...register("videoUrl")} />
            {errors.videoUrl && <p className="text-xs text-destructive">{errors.videoUrl.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="resourceUrl">Resource/Download URL (optional)</Label>
            <Input id="resourceUrl" placeholder="https://..." error={!!errors.resourceUrl} {...register("resourceUrl")} />
            {errors.resourceUrl && <p className="text-xs text-destructive">{errors.resourceUrl.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="durationMins">Duration (minutes, optional)</Label>
            <Input id="durationMins" type="number" min={1} {...register("durationMins")} />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Create Lesson
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
