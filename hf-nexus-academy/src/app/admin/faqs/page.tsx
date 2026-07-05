import { HelpCircle } from "lucide-react";

import { getAllFaqs } from "@/lib/data/admin";
import { PortalSectionHeader } from "@/components/portal/shared/section-header";
import { PortalEmptyState } from "@/components/portal/shared/empty-state";
import { CreateFaqDialog } from "@/components/portal/admin/create-faq-dialog";
import { EditFaqCard } from "@/components/portal/admin/edit-faq-card";

export const metadata = { title: "Manage FAQs" };

const PLACEMENT_LABELS: Record<string, string> = {
  general: "General (Home page)",
  pricing: "Pricing page",
  courses: "Courses page",
};

export default async function AdminFaqsPage() {
  const faqs = await getAllFaqs();

  const grouped = faqs.reduce<Record<string, typeof faqs>>((acc, faq) => {
    (acc[faq.placement] ||= []).push(faq);
    return acc;
  }, {});

  return (
    <div>
      <PortalSectionHeader
        title="Manage FAQs"
        description="Questions and answers shown on the home page, pricing page, and elsewhere."
        action={<CreateFaqDialog />}
      />

      {faqs.length === 0 ? (
        <PortalEmptyState
          icon={HelpCircle}
          title="No FAQs added yet"
          description="Use the Add FAQ button to add your first question and answer."
        />
      ) : (
        <div className="flex flex-col gap-8">
          {Object.entries(grouped).map(([placement, items]) => (
            <div key={placement}>
              <h2 className="font-display text-base text-navy-950 mb-3">
                {PLACEMENT_LABELS[placement] ?? placement}
              </h2>
              <div className="flex flex-col gap-3">
                {items.map((faq) => (
                  <EditFaqCard key={faq.id} faq={faq} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
