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
  question: z.string().min(5, "Enter the question."),
  answer: z.string().min(5, "Enter the answer."),
  placement: z.string().min(1),
  displayOrder: z.string().optional(),
});

type Values = z.infer<typeof schema>;

export function CreateFaqDialog() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { placement: "general" } });

  async function onSubmit(values: Values) {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/faqs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          displayOrder: values.displayOrder ? Number(values.displayOrder) : 0,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Could not add FAQ.");
        return;
      }

      toast.success("FAQ added.");
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
          <Plus className="h-4 w-4" /> Add FAQ
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add FAQ</DialogTitle>
          <DialogDescription>Add a question and answer to show on the site.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="question">Question</Label>
            <Input id="question" error={!!errors.question} {...register("question")} />
            {errors.question && <p className="text-xs text-destructive">{errors.question.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="answer">Answer</Label>
            <Textarea id="answer" error={!!errors.answer} {...register("answer")} />
            {errors.answer && <p className="text-xs text-destructive">{errors.answer.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="placement">Placement</Label>
              <Controller
                control={control}
                name="placement"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="placement">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General (Home page)</SelectItem>
                      <SelectItem value="pricing">Pricing page</SelectItem>
                      <SelectItem value="courses">Courses page</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="displayOrder">Display Order</Label>
              <Input id="displayOrder" type="number" defaultValue={0} {...register("displayOrder")} />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Save FAQ
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
