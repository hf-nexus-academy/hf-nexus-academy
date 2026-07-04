"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Star, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PortalSectionHeader } from "@/components/portal/shared/section-header";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";

interface PricingPlan {
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
  displayOrder: number;
  stripePriceId: string | null;
}

function PlanForm({
  plan,
  onSuccess,
}: {
  plan?: PricingPlan;
  onSuccess: () => void;
}) {
  const [name, setName] = React.useState(plan?.name ?? "");
  const [key, setKey] = React.useState(plan?.key ?? "");
  const [description, setDescription] = React.useState(plan?.description ?? "");
  const [usd, setUsd] = React.useState(plan ? String(plan.priceUSDCents / 100) : "");
  const [gbp, setGbp] = React.useState(plan ? String(plan.priceGBPCents / 100) : "");
  const [eur, setEur] = React.useState(plan ? String(plan.priceEURCents / 100) : "");
  const [features, setFeatures] = React.useState(plan?.features.join("\n") ?? "");
  const [highlighted, setHighlighted] = React.useState(plan?.isHighlighted ?? false);
  const [published, setPublished] = React.useState(plan?.isPublished ?? true);
  const [stripePriceId, setStripePriceId] = React.useState(plan?.stripePriceId ?? "");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        key: key.toUpperCase().replace(/\s+/g, "_"),
        name,
        description,
        priceUSDCents: Math.round(parseFloat(usd) * 100),
        priceGBPCents: Math.round(parseFloat(gbp) * 100),
        priceEURCents: Math.round(parseFloat(eur) * 100),
        features: features.split("\n").map((f) => f.trim()).filter(Boolean),
        isHighlighted: highlighted,
        isPublished: published,
        stripePriceId: stripePriceId.trim() || null,
      };

      const url = plan ? `/api/admin/pricing/${plan.id}` : "/api/admin/pricing";
      const method = plan ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Could not save plan.");
        return;
      }

      toast.success(plan ? "Plan updated." : "Plan created.");
      onSuccess();
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label>Plan Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Standard" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Key (auto-generated from name)</Label>
          <Input
            value={key}
            onChange={(e) => setKey(e.target.value.toUpperCase().replace(/\s+/g, "_"))}
            placeholder="e.g. STANDARD"
            disabled={!!plan}
          />
          {plan && <p className="text-xs text-ink-300">Key cannot be changed after creation.</p>}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Description</Label>
        <Input value={description} onChange={(e) => setDescription(e.target.value)} required />
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[["USD", usd, setUsd], ["GBP", gbp, setGbp], ["EUR", eur, setEur]].map(([cur, val, setter]) => (
          <div key={cur as string} className="flex flex-col gap-1.5">
            <Label>Price ({cur})</Label>
            <Input
              type="number"
              min={0}
              step="0.01"
              value={val as string}
              onChange={(e) => (setter as React.Dispatch<React.SetStateAction<string>>)(e.target.value)}
              required
              placeholder="0.00"
            />
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Features (one per line)</Label>
        <textarea
          value={features}
          onChange={(e) => setFeatures(e.target.value)}
          rows={5}
          className="rounded-sm border border-ink-300/30 bg-white px-3 py-2 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-gold-500"
          placeholder="1 live class per week&#10;Access to one course track&#10;Email support"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Stripe Price ID (optional)</Label>
        <Input
          value={stripePriceId}
          onChange={(e) => setStripePriceId(e.target.value)}
          placeholder="price_xxxxxxxxxxxx"
        />
        <p className="text-xs text-ink-300">Get this from your Stripe dashboard → Products. Required for card checkout.</p>
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm text-ink-700 cursor-pointer">
          <Switch checked={highlighted} onCheckedChange={setHighlighted} />
          <span>Mark as "Most Popular"</span>
        </label>
        <label className="flex items-center gap-2 text-sm text-ink-700 cursor-pointer">
          <Switch checked={published} onCheckedChange={setPublished} />
          <span>Published</span>
        </label>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-fit mt-2">
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
        {plan ? "Save Changes" : "Create Plan"}
      </Button>
    </form>
  );
}

export default function AdminPricingPage() {
  const router = useRouter();
  const [plans, setPlans] = React.useState<PricingPlan[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [openCreate, setOpenCreate] = React.useState(false);
  const [editingPlan, setEditingPlan] = React.useState<PricingPlan | null>(null);
  const [deleting, setDeleting] = React.useState<string | null>(null);

  async function loadPlans() {
    try {
      const res = await fetch("/api/admin/pricing");
      const data = await res.json();
      if (res.ok) setPlans(data.plans);
    } catch {
      toast.error("Could not load plans.");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => { loadPlans(); }, []);

  async function handleDelete(plan: PricingPlan) {
    if (!confirm(`Delete "${plan.name}"? This cannot be undone.`)) return;
    setDeleting(plan.id);
    try {
      const res = await fetch(`/api/admin/pricing/${plan.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "Could not delete."); return; }
      toast.success("Plan deleted.");
      loadPlans();
      router.refresh();
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div>
      <PortalSectionHeader
        title="Pricing Plans"
        description="Manage the subscription plans shown on the public pricing page."
        action={
          <Dialog open={openCreate} onOpenChange={setOpenCreate}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="h-4 w-4" /> Add Plan</Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Pricing Plan</DialogTitle>
              </DialogHeader>
              <PlanForm onSuccess={() => { setOpenCreate(false); loadPlans(); router.refresh(); }} />
            </DialogContent>
          </Dialog>
        }
      />

      {loading ? (
        <p className="text-sm text-ink-500">Loading plans...</p>
      ) : plans.length === 0 ? (
        <div className="rounded-lg border border-ink-300/15 bg-white p-10 text-center">
          <p className="text-sm text-ink-500 mb-4">No pricing plans yet. Create the first one to show pricing on the site.</p>
          <Button size="sm" onClick={() => setOpenCreate(true)}><Plus className="h-4 w-4" /> Add Plan</Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-lg border bg-white p-5 flex flex-col gap-3 ${plan.isHighlighted ? "border-gold-400" : "border-ink-300/15"}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-display text-base text-navy-950">{plan.name}</h3>
                    {plan.isHighlighted && <Star className="h-3.5 w-3.5 text-gold-500 fill-gold-500" />}
                  </div>
                  <code className="text-xs text-ink-300">{plan.key}</code>
                </div>
                <Badge variant={plan.isPublished ? "success" : "outline"}>
                  {plan.isPublished ? "Published" : "Draft"}
                </Badge>
              </div>

              <div className="flex gap-3 text-sm font-medium text-navy-950">
                <span>${plan.priceUSDCents / 100} USD</span>
                <span>£{plan.priceGBPCents / 100} GBP</span>
                <span>€{plan.priceEURCents / 100} EUR</span>
              </div>

              {plan.features.length > 0 && (
                <ul className="text-xs text-ink-500 space-y-1">
                  {plan.features.slice(0, 3).map((f) => <li key={f}>• {f}</li>)}
                  {plan.features.length > 3 && <li className="text-ink-300">+{plan.features.length - 3} more</li>}
                </ul>
              )}

              {plan.stripePriceId ? (
                <p className="text-xs text-green-600">✓ Stripe configured</p>
              ) : (
                <p className="text-xs text-amber-600">⚠ No Stripe Price ID set</p>
              )}

              <div className="flex gap-2 mt-auto pt-2 border-t border-ink-300/10">
                <Dialog open={editingPlan?.id === plan.id} onOpenChange={(o) => { if (!o) setEditingPlan(null); }}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => setEditingPlan(plan)}>
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Edit — {plan.name}</DialogTitle>
                    </DialogHeader>
                    {editingPlan?.id === plan.id && (
                      <PlanForm
                        plan={editingPlan}
                        onSuccess={() => { setEditingPlan(null); loadPlans(); router.refresh(); }}
                      />
                    )}
                  </DialogContent>
                </Dialog>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={deleting === plan.id}
                  onClick={() => handleDelete(plan)}
                  className="text-destructive hover:bg-destructive/10"
                >
                  {deleting === plan.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
