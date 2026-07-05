import { Tag } from "lucide-react";

import { getAllPricingPlans } from "@/lib/data/admin";
import { PortalSectionHeader } from "@/components/portal/shared/section-header";
import { PortalEmptyState } from "@/components/portal/shared/empty-state";
import { CreatePricingPlanDialog } from "@/components/portal/admin/create-pricing-plan-dialog";
import { EditPricingPlanCard } from "@/components/portal/admin/edit-pricing-plan-card";

export const metadata = { title: "Manage Pricing Plans" };

export default async function AdminPricingPage() {
  const plans = await getAllPricingPlans();

  return (
    <div>
      <PortalSectionHeader
        title="Manage Pricing Plans"
        description="Plans shown on the pricing page and home page. Set the Stripe Price ID for each plan before publishing."
        action={<CreatePricingPlanDialog />}
      />

      {plans.length === 0 ? (
        <PortalEmptyState
          icon={Tag}
          title="No pricing plans yet"
          description="Use the Add Plan button to create your first subscription tier."
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {plans.map((plan) => (
            <EditPricingPlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      )}
    </div>
  );
}
