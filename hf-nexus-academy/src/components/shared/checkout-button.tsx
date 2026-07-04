"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { CURRENCIES } from "@/lib/constants";

type CheckoutTarget = { planKey: string; courseId?: never } | { planKey?: never; courseId: string };

export function CheckoutButton({
  currency,
  highlighted,
  label = "Get Started",
  loginCallbackUrl = "/pricing",
  ...target
}: CheckoutTarget & {
  currency: (typeof CURRENCIES)[number];
  highlighted?: boolean;
  label?: string;
  loginCallbackUrl?: string;
}) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [open, setOpen] = React.useState(false);
  const [loadingProvider, setLoadingProvider] = React.useState<"stripe" | "paypal" | null>(null);

  function handleGetStarted() {
    if (status !== "authenticated") {
      router.push(`/login?callbackUrl=${encodeURIComponent(loginCallbackUrl)}`);
      return;
    }
    if (session?.user.role !== "STUDENT") {
      toast.error("Only student accounts can check out.");
      return;
    }
    setOpen(true);
  }

  async function handleStripeCheckout() {
    setLoadingProvider("stripe");
    try {
      const res = await fetch("/api/checkout/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...target, currency }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Could not start checkout.");
        setLoadingProvider(null);
        return;
      }

      window.location.href = data.url;
    } catch {
      toast.error("Something went wrong.");
      setLoadingProvider(null);
    }
  }

  async function handlePayPalCheckout() {
    setLoadingProvider("paypal");
    try {
      const res = await fetch("/api/checkout/paypal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...target, currency }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Could not start checkout.");
        setLoadingProvider(null);
        return;
      }

      // In production, redirect to PayPal's approval URL or render PayPal Buttons
      // client-side using this orderId. Simplified here to a direct approval redirect.
      toast.success("PayPal order created. Redirecting to approval...");
      router.push(`/student/billing?paypalOrderId=${data.orderId}`);
    } catch {
      toast.error("Something went wrong.");
      setLoadingProvider(null);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={handleGetStarted} className="w-full" variant={highlighted ? "gold" : "primary"}>
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Choose a payment method</DialogTitle>
          <DialogDescription>Select how you&apos;d like to pay.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <Button onClick={handleStripeCheckout} disabled={loadingProvider !== null} className="w-full">
            {loadingProvider === "stripe" && <Loader2 className="h-4 w-4 animate-spin" />}
            Pay with Card (Stripe)
          </Button>
          <Button
            onClick={handlePayPalCheckout}
            disabled={loadingProvider !== null}
            variant="outline"
            className="w-full"
          >
            {loadingProvider === "paypal" && <Loader2 className="h-4 w-4 animate-spin" />}
            Pay with PayPal
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
