"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Plus, Copy } from "lucide-react";

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

const formSchema = z.object({
  name: z.string().min(2, "Enter the teacher's full name."),
  email: z.string().email("Enter a valid email address."),
  title: z.string().optional(),
  bio: z.string().min(10, "Add a short biography (10+ characters)."),
  specializations: z.string().min(1, "List at least one specialization."),
  experienceYears: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateTeacherDialog() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [tempPassword, setTempPassword] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(formSchema) });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/teachers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          specializations: values.specializations.split(",").map((s) => s.trim()).filter(Boolean),
          experienceYears: values.experienceYears ? Number(values.experienceYears) : undefined,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Could not create teacher.");
        return;
      }

      setTempPassword(data.temporaryPassword);
      toast.success("Teacher account created.");
      router.refresh();
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleClose() {
    setOpen(false);
    setTempPassword(null);
    reset();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? setOpen(true) : handleClose())}>
      <DialogTrigger asChild>
        <Button size="sm" variant="gold">
          <Plus className="h-4 w-4" /> Add Teacher
        </Button>
      </DialogTrigger>
      <DialogContent>
        {tempPassword ? (
          <div className="flex flex-col gap-4">
            <DialogHeader>
              <DialogTitle>Teacher Account Created</DialogTitle>
              <DialogDescription>
                Share this temporary password with the teacher. They should change it after first login.
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center justify-between gap-3 rounded-md bg-cream-100 px-4 py-3">
              <code className="text-sm font-mono text-navy-950">{tempPassword}</code>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(tempPassword);
                  toast.success("Copied to clipboard.");
                }}
                aria-label="Copy password"
                className="text-ink-500 hover:text-gold-600"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
            <DialogFooter>
              <Button onClick={handleClose}>Done</Button>
            </DialogFooter>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Add Teacher</DialogTitle>
              <DialogDescription>Create a new teacher account and profile.</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" error={!!errors.name} {...register("name")} />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" error={!!errors.email} {...register("email")} />
                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="title">Title (optional, e.g. Mufti)</Label>
                <Input id="title" {...register("title")} />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="bio">Biography</Label>
                <Textarea id="bio" error={!!errors.bio} {...register("bio")} />
                {errors.bio && <p className="text-xs text-destructive">{errors.bio.message}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="specializations">Specializations (comma-separated)</Label>
                <Input id="specializations" placeholder="Fiqh, Quran, Tajweed" error={!!errors.specializations} {...register("specializations")} />
                {errors.specializations && <p className="text-xs text-destructive">{errors.specializations.message}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="experienceYears">Years of Experience (optional)</Label>
                <Input id="experienceYears" type="number" min={0} {...register("experienceYears")} />
              </div>

              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  Create Teacher
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
