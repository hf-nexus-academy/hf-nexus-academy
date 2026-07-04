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
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const schema = z.object({
  priceMonthlyCents: z.string().optional(),
  priceCurrency: z.enum(["USD", "GBP", "EUR"]),
});

type Values = z.infer<typeof schema>;

export function CoursePricingForm({
  courseId,
  defaultValues,
}: {
  courseId: string;
  defaultValues: { priceMonthlyCents: number | null; priceCurrency: string };
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const { register, handleSubmit, control } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      priceMonthlyCents:
        defaultValues.priceMonthlyCents !== null ? String(defaultValues.priceMonthlyCents / 100) : "",
      priceCurrency: (defaultValues.priceCurrency as "USD" | "GBP" | "EUR") ?? "USD",
    },
  });

  async function onSubmit(values: Values) {
    setIsSubmitting(true);
    try {
      const priceMonthlyCents =
        values.priceMonthlyCents && values.priceMonthlyCents.trim() !== ""
          ? Math.round(parseFloat(values.priceMonthlyCents) * 100)
          : null;

      const res = await fetch(`/api/admin/courses/${courseId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceMonthlyCents, priceCurrency: values.priceCurrency }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Could not update pricing.");
        return;
      }

      toast.success("Pricing updated.");
      router.refresh();
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 max-w-sm">
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="priceMonthlyCents">Monthly Price</Label>
          <Input
            id="priceMonthlyCents"
            type="number"
            min={0}
            step="0.01"
            placeholder="Leave blank for plan-only"
            {...register("priceMonthlyCents")}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="priceCurrency">Currency</Label>
          <Controller
            control={control}
            name="priceCurrency"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger id="priceCurrency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>
      <p className="text-xs text-ink-300">
        Leave price blank if this course is only available through subscription plans, not sold individually.
      </p>
      <Button type="submit" disabled={isSubmitting} size="sm" className="w-fit">
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
        Save Pricing
      </Button>
    </form>
  );
}
