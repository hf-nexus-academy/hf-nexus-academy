import { MessageSquareQuote, Star } from "lucide-react";

import { getAllTestimonials } from "@/lib/data/admin";
import { PortalSectionHeader } from "@/components/portal/shared/section-header";
import { PortalEmptyState } from "@/components/portal/shared/empty-state";
import { CreateTestimonialDialog } from "@/components/portal/admin/create-testimonial-dialog";
import { PublishToggle } from "@/components/portal/admin/publish-toggle";
import { DeleteButton } from "@/components/portal/admin/delete-button";

export const metadata = { title: "Manage Testimonials" };

export default async function AdminTestimonialsPage() {
  const testimonials = await getAllTestimonials();

  return (
    <div>
      <PortalSectionHeader
        title="Manage Testimonials"
        description="Add and publish real student testimonials. New testimonials are hidden by default."
        action={<CreateTestimonialDialog />}
      />

      {testimonials.length === 0 ? (
        <PortalEmptyState
          icon={MessageSquareQuote}
          title="No testimonials added yet"
          description="Use the Add Testimonial button to add your first real student review."
        />
      ) : (
        <div className="grid sm:grid-cols-2 gap-5">
          {testimonials.map((t) => (
            <div key={t.id} className="rounded-lg border border-ink-300/15 bg-white p-6 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <div className="flex gap-0.5 text-gold-500">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
                <DeleteButton
                  endpoint={`/api/admin/testimonials/${t.id}`}
                  confirmMessage="Delete this testimonial permanently?"
                />
              </div>
              <p className="text-sm text-ink-700 leading-relaxed mb-4 flex-1">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center justify-between pt-3 border-t border-ink-300/10">
                <div>
                  <p className="text-sm font-medium text-navy-950">{t.studentName}</p>
                  <p className="text-xs text-ink-500">
                    {[t.country, t.courseTaken].filter(Boolean).join(" · ")}
                  </p>
                </div>
                <PublishToggle
                  initialPublished={t.isPublished}
                  endpoint={`/api/admin/testimonials/${t.id}`}
                  field="isPublished"
                  label="Published"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
