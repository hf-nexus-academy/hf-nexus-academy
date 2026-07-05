"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { COUNTRIES, COURSE_CATEGORY_LABELS } from "@/lib/constants";

const schema = z.object({
  fullName: z.string().min(2, "Enter your full name."),
  email: z.string().email("Enter a valid email address."),
  whatsapp: z.string().min(5, "Enter a valid WhatsApp number."),
  country: z.string().min(1, "Select your country."),
  age: z.string().optional(),
  courseInterest: z.string().min(1, "Select a course."),
});

type Values = z.infer<typeof schema>;

const COURSE_OPTIONS = Object.entries(COURSE_CATEGORY_LABELS);

export function FreeTrialForm() {
  const searchParams = useSearchParams();
  const courseParam = searchParams.get("course");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      courseInterest: courseParam?.includes("quran")
        ? "QURAN"
        : courseParam?.includes("hadith")
        ? "HADITH"
        : courseParam?.includes("fiqh")
        ? "FIQH"
        : courseParam?.includes("arabic")
        ? "ARABIC"
        : courseParam?.includes("logic")
        ? "LOGIC"
        : "",
    },
  });

  async function onSubmit(values: Values) {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/free-trial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          age: values.age ? Number(values.age) : undefined,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Something went wrong.");
        setIsSubmitting(false);
        return;
      }

      setIsSubmitted(true);
    } catch {
      toast.error("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  }

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center text-center gap-4 py-10 rounded-lg bg-cream-100 border border-gold-500/20">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gold-100">
          <CheckCircle2 className="h-7 w-7 text-gold-700" />
        </div>
        <h3 className="font-display text-xl text-navy-950">Request Received</h3>
        <p className="text-sm text-ink-500 max-w-sm">
          Thank you for your interest in HF Nexus Academy. Our admissions team will
          reach out via email or WhatsApp shortly to schedule your free trial class.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid sm:grid-cols-2 gap-5">
      <div className="flex flex-col gap-1.5 sm:col-span-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input id="fullName" placeholder="Your full name" error={!!errors.fullName} {...register("fullName")} />
        {errors.fullName && <p className="text-xs text-destructive">{errors.fullName.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="you@example.com" error={!!errors.email} {...register("email")} />
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="whatsapp">WhatsApp Number</Label>
        <Input id="whatsapp" placeholder="+1 555 123 4567" error={!!errors.whatsapp} {...register("whatsapp")} />
        {errors.whatsapp && <p className="text-xs text-destructive">{errors.whatsapp.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="country">Country</Label>
        <Controller
          control={control}
          name="country"
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger id="country">
                <SelectValue placeholder="Select your country" />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.country && <p className="text-xs text-destructive">{errors.country.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="age">Age (optional)</Label>
        <Input id="age" type="number" min={3} max={100} placeholder="e.g. 24" {...register("age")} />
      </div>

      <div className="flex flex-col gap-1.5 sm:col-span-2">
        <Label htmlFor="courseInterest">Course Interested In</Label>
        <Controller
          control={control}
          name="courseInterest"
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger id="courseInterest">
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                {COURSE_OPTIONS.map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.courseInterest && <p className="text-xs text-destructive">{errors.courseInterest.message}</p>}
      </div>

      <Button type="submit" disabled={isSubmitting} size="lg" className="sm:col-span-2 mt-2">
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
        Book My Free Trial
      </Button>
    </form>
  );
}
