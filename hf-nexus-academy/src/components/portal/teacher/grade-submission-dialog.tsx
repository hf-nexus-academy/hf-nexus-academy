"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

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

export function GradeSubmissionDialog({
  submissionId,
  studentName,
  maxScore,
  existingScore,
  existingFeedback,
}: {
  submissionId: string;
  studentName: string;
  maxScore: number;
  existingScore?: number | null;
  existingFeedback?: string | null;
}) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const schema = z.object({
    score: z.coerce.number().int().min(0).max(maxScore, `Score cannot exceed ${maxScore}.`),
    feedback: z.string().optional(),
  });
  type Values = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { score: existingScore ?? undefined, feedback: existingFeedback ?? "" },
  });

  async function onSubmit(values: Values) {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/teacher/submissions/${submissionId}/grade`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Could not save grade.");
        return;
      }

      toast.success("Submission graded.");
      setOpen(false);
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
        <Button size="sm" variant={existingScore !== null && existingScore !== undefined ? "outline" : "gold"}>
          {existingScore !== null && existingScore !== undefined ? "Edit Grade" : "Grade"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Grade Submission</DialogTitle>
          <DialogDescription>{studentName}&apos;s submission, out of {maxScore} points.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="score">Score (out of {maxScore})</Label>
            <Input id="score" type="number" min={0} max={maxScore} error={!!errors.score} {...register("score")} />
            {errors.score && <p className="text-xs text-destructive">{errors.score.message}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="feedback">Feedback (optional)</Label>
            <Textarea id="feedback" placeholder="Add feedback for the student..." {...register("feedback")} />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Save Grade
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
