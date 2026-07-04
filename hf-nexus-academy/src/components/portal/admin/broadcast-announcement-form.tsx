"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Megaphone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const ROLES: { value: "STUDENT" | "TEACHER" | "ADMIN"; label: string }[] = [
  { value: "STUDENT", label: "Students" },
  { value: "TEACHER", label: "Teachers" },
  { value: "ADMIN", label: "Admins" },
];

const schema = z.object({
  title: z.string().min(2, "Enter a title."),
  message: z.string().min(2, "Write a message."),
});

type Values = z.infer<typeof schema>;

export function BroadcastAnnouncementForm() {
  const router = useRouter();
  const [audience, setAudience] = React.useState<string[]>(["STUDENT"]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Values>({ resolver: zodResolver(schema) });

  function toggleAudience(role: string) {
    setAudience((prev) => (prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]));
  }

  async function onSubmit(values: Values) {
    if (audience.length === 0) {
      toast.error("Select at least one audience.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, audience }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Could not send announcement.");
        return;
      }

      toast.success(data.message);
      reset();
      router.refresh();
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 max-w-md">
      <div className="flex flex-col gap-2">
        <Label>Audience</Label>
        <div className="flex flex-wrap gap-2">
          {ROLES.map((role) => (
            <button
              key={role.value}
              type="button"
              onClick={() => toggleAudience(role.value)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium border transition-colors ${
                audience.includes(role.value)
                  ? "bg-navy-950 text-cream-50 border-navy-950"
                  : "border-ink-300/30 text-ink-500"
              }`}
            >
              {role.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="title">Title</Label>
        <Input id="title" error={!!errors.title} {...register("title")} />
        {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" error={!!errors.message} {...register("message")} />
        {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-fit">
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
        <Megaphone className="h-4 w-4" /> Broadcast Announcement
      </Button>
    </form>
  );
}
