import { CreditCard } from "lucide-react";

import { getAllPayments, getAllStudents, getAllPricingPlans, getAllCourses } from "@/lib/data/admin";
import { PortalSectionHeader } from "@/components/portal/shared/section-header";
import { PortalEmptyState } from "@/components/portal/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { RecordPaymentDialog } from "@/components/portal/admin/record-payment-dialog";
import { formatCurrency, formatDate } from "@/lib/utils";

export const metadata = { title: "Payments" };

const STATUS_VARIANT: Record<string, "success" | "warning" | "destructive" | "outline"> = {
  SUCCEEDED: "success",
  PENDING: "warning",
  FAILED: "destructive",
  REFUNDED: "outline",
  CANCELLED: "outline",
};

export default async function AdminPaymentsPage() {
  const [payments, students, plans, courses] = await Promise.all([
    getAllPayments(),
    getAllStudents(),
    getAllPricingPlans(),
    getAllCourses(),
  ]);

  const totalRevenue = payments
    .filter((p) => p.status === "SUCCEEDED")
    .reduce((sum, p) => sum + p.amountCents, 0);

  return (
    <div>
      <PortalSectionHeader
        title="Payments"
        description={`${formatCurrency(totalRevenue)} in total successful revenue.`}
        action={
          <RecordPaymentDialog
            students={students.map((s) => ({ id: s.id, name: s.user.name, email: s.user.email }))}
            plans={plans.map((p) => ({ key: p.key, name: p.name }))}
            courses={courses.map((c) => ({ id: c.id, title: c.title }))}
          />
        }
      />

      {payments.length === 0 ? (
        <PortalEmptyState
          icon={CreditCard}
          title="No payments recorded yet"
          description="Use the Record Payment button to log a payment you've received manually."
        />
      ) : (
        <div className="rounded-lg border border-ink-300/15 bg-white overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead className="bg-cream-100 text-ink-500 text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left px-5 py-3 font-medium">Student</th>
                <th className="text-left px-5 py-3 font-medium">Plan</th>
                <th className="text-left px-5 py-3 font-medium">Provider</th>
                <th className="text-left px-5 py-3 font-medium">Amount</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
                <th className="text-left px-5 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-300/10">
              {payments.map((p) => (
                <tr key={p.id}>
                  <td className="px-5 py-3.5 text-navy-950">{p.student.user.name}</td>
                  <td className="px-5 py-3.5 text-ink-500">{p.planKey}</td>
                  <td className="px-5 py-3.5 text-ink-500">{p.provider}</td>
                  <td className="px-5 py-3.5 text-navy-950 font-medium">
                    {formatCurrency(p.amountCents, p.currency)}
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge variant={STATUS_VARIANT[p.status]}>{p.status}</Badge>
                  </td>
                  <td className="px-5 py-3.5 text-ink-300">{formatDate(p.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
