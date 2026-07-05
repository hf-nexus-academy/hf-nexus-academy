import { Star } from "lucide-react";

/**
 * NOTE: Per the project brief, no fabricated student reviews are included here.
 * This section renders a placeholder structure ready to display real testimonials
 * once collected. Connect this to the `Testimonial` model (isPublished: true)
 * via the admin portal's testimonial management screen.
 */
const PLACEHOLDER_SLOTS = [1, 2, 3];

export function Testimonials() {
  return (
    <section className="bg-navy-950 py-20 lg:py-28">
      <div className="container">
        <div className="max-w-2xl mb-14">
          <span className="text-xs uppercase tracking-[0.2em] text-gold-500 font-medium">
            Student Testimonials
          </span>
          <h2 className="font-display text-3xl lg:text-4xl text-cream-50 mt-3 text-balance">
            What our students say
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PLACEHOLDER_SLOTS.map((slot) => (
            <div
              key={slot}
              className="rounded-lg border border-dashed border-cream-50/15 bg-navy-900/40 p-7 flex flex-col items-center justify-center text-center min-h-[220px]"
            >
              <div className="flex gap-1 mb-4 text-gold-500/30">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-sm text-cream-50/35">
                Testimonial pending — published reviews will appear here once
                approved in the admin portal.
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
