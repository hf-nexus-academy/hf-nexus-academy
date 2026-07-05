"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
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

const schema = z.object({
  studentName: z.string().min(2, "Enter the student's name."),
  country: z.string().optional(),
  courseTaken: z.string().optional(),
  quote: z.string().min(10, "Add the testimonial text (10+ characters)."),
});

type Values = z.infer<typeof schema>;

export function CreateTestimonialDialog() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Values>({ resolver: zodResolver(schema) });

  async function onSubmit(values: Values) {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Could not add testimonial.");
        return;
      }

      toast.success("Testimonial added (unpublished by default).");
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
          <Plus className="h-4 w-4" /> Add Testimonial
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Testimonial</DialogTitle>
          <DialogDescription>
            Add a real student testimonial. It will be hidden from the website until published.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="studentName">Student Name</Label>
            <Input id="studentName" error={!!errors.studentName} {...register("studentName")} />
            {errors.studentName && <p className="text-xs text-destructive">{errors.studentName.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="country">Country (optional)</Label>
              <Input id="country" {...register("country")} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="courseTaken">Course (optional)</Label>
              <Input id="courseTaken" {...register("courseTaken")} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="quote">Testimonial</Label>
            <Textarea id="quote" error={!!errors.quote} {...register("quote")} />
            {errors.quote && <p className="text-xs text-destructive">{errors.quote.message}</p>}
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Add Testimonial
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
