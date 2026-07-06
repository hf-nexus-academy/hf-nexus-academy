"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Pencil, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { PublishToggle } from "@/components/portal/admin/publish-toggle";
import { DeleteButton } from "@/components/portal/admin/delete-button";

type Plan = {
  id: string;
  key: string;
  name: string;
  description: string;
  priceUSDCents: number;
  priceGBPCents: number;
  priceEURCents: number;
  features: string[];
  isHighlighted: boolean;
  isPublished: boolean;
  stripePriceId: string | null;
};

export function EditPricingPlanCard({ plan }: { plan: Plan }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isHighlighted, setIsHighlighted] = React.useState(plan.isHighlighted);

  const [form, setForm] = React.useState({
    name: plan.name,
    description: plan.description,
    priceUSDCents: String(plan.priceUSDCents),
    priceGBPCents: String(plan.priceGBPCents),
    priceEURCents: String(plan.priceEURCents),
    features: plan.features.join("\n"),
    stripePriceId: plan.stripePriceId ?? "",
  });

  async function persist(patch: Record<string, unknown>) {
    const res = await fetch(`/api/admin/pricing/${plan.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error || "Could not update plan.");
      return false;
    }
    return true;
  }

  async function handleSave() {
    setIsSaving(true);
    try {
      const ok = await persist({
        name: form.name,
        description: form.description,
        priceUSDCents: Number(form.priceUSDCents),
        priceGBPCents: Number(form.priceGBPCents),
        priceEURCents: Number(form.priceEURCents),
        features: form.features.split("\n").map((f) => f.trim()).filter(Boolean),
        stripePriceId: form.stripePriceId || null,
      });
      if (ok) {
        toast.success("Plan updated.");
        setIsEditing(false);
        router.refresh();
      }
    } finally {
      setIsSaving(false);
    }
  }

  async function handleHighlightedChange(checked: boolean) {
    setIsHighlighted(checked);
    const ok = await persist({ isHighlighted: checked });
    if (ok) {
      toast.success(checked ? "Plan highlighted." : "Highlight removed.");
      router.refresh();
    } else {
      setIsHighlighted(!checked);
    }
  }

  return (
    <div className="rounded-lg border border-ink-300/15 bg-white p-6">
      <div className="flex items-center justify-between mb-4">
        <Badge variant="outline">{plan.key}</Badge>
        <div className="flex items-center gap-3">
          <PublishToggle
            initialPublished={plan.isPublished}
            endpoint={`/api/admin/pricing/${plan.id}`}
            field="isPublished"
            label="Published"
          />
          <button
            onClick={() => setIsEditing((v) => !v)}
            aria-label="Edit"
            className="text-ink-300 hover:text-gold-600 transition-colors"
          >
            {isEditing ? <X className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
          </button>
          <DeleteButton
            endpoint={`/api/admin/pricing/${plan.id}`}
            confirmMessage="Delete this pricing plan permanently? This is only possible if no payments reference it."
          />
        </div>
      </div>

      {isEditing ? (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label>Plan Name</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Description</Label>
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label>USD (cents)</Label>
              <Input
                type="number"
                value={form.priceUSDCents}
                onChange={(e) => setForm({ ...form, priceUSDCents: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>GBP (cents)</Label>
              <Input
                type="number"
                value={form.priceGBPCents}
                onChange={(e) => setForm({ ...form, priceGBPCents: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>EUR (cents)</Label>
              <Input
                type="number"
                value={form.priceEURCents}
                onChange={(e) => setForm({ ...form, priceEURCents: e.target.value })}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Features (one per line)</Label>
            <Textarea
              className="min-h-[120px]"
              value={form.features}
              onChange={(e) => setForm({ ...form, features: e.target.value })}
            />
          </div>
          <Button size="sm" onClick={handleSave} disabled={isSaving} className="w-fit">
            {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
            Save Plan
          </Button>
        </div>
      ) : (
        <div>
          <p className="font-display text-lg text-navy-950">{plan.name}</p>
          <p className="text-sm text-ink-500 mb-3">{plan.description}</p>
          <p className="text-sm text-navy-950 mb-3">
            ${(plan.priceUSDCents / 100).toFixed(2)} · £{(plan.priceGBPCents / 100).toFixed(2)} · €
            {(plan.priceEURCents / 100).toFixed(2)}{" "}
            <span className="text-ink-500">/ month</span>
          </p>
          <ul className="text-sm text-ink-500 list-disc pl-4 mb-3 flex flex-col gap-0.5">
            {plan.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-ink-300/10">
        <Switch checked={isHighlighted} onCheckedChange={handleHighlightedChange} aria-label="Highlighted" />
        <span className="text-xs text-ink-500">{isHighlighted ? "Highlighted plan" : "Not highlighted"}</span>
      </div>
    </div>
  );
}
