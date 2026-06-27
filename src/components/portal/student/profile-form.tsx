"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { COUNTRIES } from "@/lib/constants";

const schema = z.object({
  name: z.string().min(2, "Enter your full name."),
  country: z.string().optional(),
  whatsapp: z.string().optional(),
  age: z.string().optional(),
});

type Values = z.infer<typeof schema>;

export function ProfileForm({
  defaultValues,
  email,
}: {
  defaultValues: { name: string; country: string | null; whatsapp: string | null; age: number | null };
  email: string;
}) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: defaultValues.name,
      country: defaultValues.country ?? "",
      whatsapp: defaultValues.whatsapp ?? "",
      age: defaultValues.age ? String(defaultValues.age) : "",
    },
  });

  async function onSubmit(values: Values) {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/student/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Could not update profile.");
        return;
      }

      toast.success("Profile updated.");
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 max-w-md">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email address</Label>
        <Input id="email" value={email} disabled />
        <p className="text-xs text-ink-300">Email cannot be changed. Contact support if needed.</p>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Full name</Label>
        <Input id="name" error={!!errors.name} {...register("name")} />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
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
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="whatsapp">WhatsApp number</Label>
        <Input id="whatsapp" placeholder="+1 555 123 4567" {...register("whatsapp")} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="age">Age</Label>
        <Input id="age" type="number" min={3} max={100} {...register("age")} />
      </div>

      <Button type="submit" disabled={isSubmitting} className="mt-2 w-fit">
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
        Save Changes
      </Button>
    </form>
  );
}
