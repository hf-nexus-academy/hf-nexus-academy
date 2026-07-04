import { Star } from "lucide-react";
import { getPublishedTestimonials } from "@/lib/data/public";

export async function Testimonials() {
  const testimonials = await getPublishedTestimonials();

  if (testimonials.length === 0) return null;

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
          {testimonials.map((t) => (
            <div key={t.id} className="rounded-lg border border-cream-50/10 bg-navy-900/50 p-7 flex flex-col">
              <div className="flex gap-0.5 text-gold-500 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-sm text-cream-50/80 leading-relaxed flex-1 mb-5">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="pt-4 border-t border-cream-50/10">
                <p className="text-sm font-medium text-cream-50">{t.studentName}</p>
                {(t.country || t.courseTaken) && (
                  <p className="text-xs text-cream-50/40 mt-0.5">
                    {[t.country, t.courseTaken].filter(Boolean).join(" · ")}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
