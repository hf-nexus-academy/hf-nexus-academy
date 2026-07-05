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
  key: z
    .string()
    .min(2, "Enter a machine key (e.g. STARTER).")
    .regex(/^[A-Z0-9_]+$/, "Uppercase letters, numbers, underscores only."),
  name: z.string().min(2, "Enter a plan name."),
  description: z.string().min(2, "Enter a short description."),
  priceUSDCents: z.string().min(1, "Enter the USD price in cents."),
  priceGBPCents: z.string().min(1, "Enter the GBP price in cents."),
  priceEURCents: z.string().min(1, "Enter the EUR price in cents."),
  features: z.string().min(1, "List at least one feature, one per line."),
});

type Values = z.infer<typeof schema>;

export function CreatePricingPlanDialog() {
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
      const res = await fetch("/api/admin/pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: values.key,
          name: values.name,
          description: values.description,
          priceUSDCents: Number(values.priceUSDCents),
          priceGBPCents: Number(values.priceGBPCents),
          priceEURCents: Number(values.priceEURCents),
          features: values.features.split("\n").map((f) => f.trim()).filter(Boolean),
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Could not create plan.");
        return;
      }

      toast.success("Pricing plan created.");
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
          <Plus className="h-4 w-4" /> Add Plan
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Pricing Plan</DialogTitle>
          <DialogDescription>
            The machine key is used internally for checkout and can&apos;t be changed later.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-1">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="key">Machine Key (e.g. STARTER)</Label>
            <Input id="key" error={!!errors.key} {...register("key")} />
            {errors.key && <p className="text-xs text-destructive">{errors.key.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Plan Name</Label>
            <Input id="name" error={!!errors.name} {...register("name")} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" error={!!errors.description} {...register("description")} />
            {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="priceUSDCents">USD (cents)</Label>
              <Input id="priceUSDCents" type="number" error={!!errors.priceUSDCents} {...register("priceUSDCents")} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="priceGBPCents">GBP (cents)</Label>
              <Input id="priceGBPCents" type="number" error={!!errors.priceGBPCents} {...register("priceGBPCents")} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="priceEURCents">EUR (cents)</Label>
              <Input id="priceEURCents" type="number" error={!!errors.priceEURCents} {...register("priceEURCents")} />
            </div>
          </div>
          <p className="text-xs text-ink-500 -mt-2">Enter prices in cents, e.g. 5900 for $59.00.</p>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="features">Features (one per line)</Label>
            <Textarea id="features" className="min-h-[120px]" error={!!errors.features} {...register("features")} />
            {errors.features && <p className="text-xs text-destructive">{errors.features.message}</p>}
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Create Plan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
