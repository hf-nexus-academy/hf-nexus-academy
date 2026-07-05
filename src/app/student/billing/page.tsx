import { Suspense } from "react";
import { CreditCard, CheckCircle2 } from "lucide-react";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PortalSectionHeader } from "@/components/portal/shared/section-header";
import { PortalEmptyState } from "@/components/portal/shared/empty-state";
import { PayPalCaptureHandler } from "@/components/portal/student/paypal-capture-handler";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";

export const metadata = { title: "Billing" };

const STATUS_VARIANT: Record<string, "success" | "warning" | "destructive" | "outline"> = {
  SUCCEEDED: "success",
  PENDING: "warning",
  FAILED: "destructive",
  REFUNDED: "outline",
  CANCELLED: "outline",
};

export default async function StudentBillingPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const { success } = await searchParams;
  const session = await auth();
  const student = await prisma.student.findUnique({ where: { userId: session!.user.id } });

  const payments = student
    ? await prisma.payment.findMany({ where: { studentId: student.id }, orderBy: { createdAt: "desc" } })
    : [];

  return (
    <div>
      <PortalSectionHeader title="Billing" description="Your subscription and payment history." />

      <Suspense>
        <PayPalCaptureHandler />
      </Suspense>

      {success && (
        <div className="flex items-center gap-3 rounded-lg border border-emerald-300 bg-emerald-50 p-5 mb-6">
          <CheckCircle2 className="h-5 w-5 text-emerald-700" />
          <p className="text-sm text-navy-950">Your subscription payment was successful.</p>
        </div>
      )}

      {payments.length === 0 ? (
        <PortalEmptyState
          icon={CreditCard}
          title="No payment history yet"
          description="Once you subscribe to a plan, your payment history will appear here."
        />
      ) : (
        <div className="rounded-lg border border-ink-300/15 bg-white divide-y divide-ink-300/10">
          {payments.map((p) => (
            <div key={p.id} className="flex items-center justify-between gap-4 p-5">
              <div>
                <p className="text-sm font-medium text-navy-950">{p.planKey} Plan</p>
                <p className="text-xs text-ink-500 mt-0.5">
                  {p.provider} · {formatDate(p.createdAt)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-navy-950">{formatCurrency(p.amountCents, p.currency)}</p>
                <Badge variant={STATUS_VARIANT[p.status]}>{p.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
