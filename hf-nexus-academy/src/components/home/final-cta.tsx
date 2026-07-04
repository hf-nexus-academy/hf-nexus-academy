import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FinalCta() {
  return (
    <section className="relative bg-navy-950 py-20 lg:py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-gold-500/5 via-transparent to-transparent" />
      <div className="container relative text-center max-w-2xl">
        <h2 className="font-display text-3xl lg:text-4xl text-cream-50 text-balance">
          Begin your Islamic learning journey today
        </h2>
        <p className="mt-4 text-cream-50/65 leading-relaxed">
          Book a free trial class and experience HF Nexus Academy's teaching firsthand —
          no commitment required.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button asChild size="lg" variant="gold">
            <Link href="/free-trial">
              Book Your Free Trial <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-cream-50/30 text-cream-50 hover:bg-cream-50 hover:text-navy-950">
            <Link href="/courses">Browse Courses</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
