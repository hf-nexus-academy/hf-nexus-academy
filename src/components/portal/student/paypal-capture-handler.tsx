"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, CheckCircle2 } from "lucide-react";

export function PayPalCaptureHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("paypalOrderId");
  const [status, setStatus] = React.useState<"idle" | "capturing" | "done" | "error">("idle");

  React.useEffect(() => {
    if (!orderId) return;

    setStatus("capturing");
    fetch("/api/checkout/paypal/capture", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.error || "Payment could not be completed.");
          setStatus("error");
          return;
        }
        toast.success("Payment successful!");
        setStatus("done");
        router.replace("/student/billing");
      })
      .catch(() => {
        toast.error("Something went wrong completing your payment.");
        setStatus("error");
      });
  }, [orderId, router]);

  if (status === "capturing") {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-gold-500/30 bg-gold-50 p-5 mb-6">
        <Loader2 className="h-5 w-5 text-gold-700 animate-spin" />
        <p className="text-sm text-navy-950">Completing your PayPal payment...</p>
      </div>
    );
  }

  if (status === "done") {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-emerald-300 bg-emerald-50 p-5 mb-6">
        <CheckCircle2 className="h-5 w-5 text-emerald-700" />
        <p className="text-sm text-navy-950">Payment completed successfully.</p>
      </div>
    );
  }

  return null;
}
