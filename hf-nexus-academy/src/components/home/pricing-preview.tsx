import Link from "next/link";
import { PricingCards } from "@/components/shared/pricing-cards";
import { prisma } from "@/lib/prisma";

export async function PricingPreview() {
  const plans = await prisma.pricingPlan.findMany({
    where: { isPublished: true },
    orderBy: { displayOrder: "asc" },
  });

  return (
    <section className="bg-cream-100 py-20 lg:py-28">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center mb-14">
          <span className="text-xs uppercase tracking-[0.2em] text-gold-600 font-medium">Pricing</span>
          <h2 className="font-display text-3xl lg:text-4xl text-navy-950 mt-3 text-balance">
            Simple plans for every stage of learning
          </h2>
        </div>
        <PricingCards plans={plans} />
        <p className="text-center text-sm text-ink-500 mt-10">
          Need help choosing?{" "}
          <Link href="/pricing" className="text-gold-700 font-medium hover:underline">
            See full plan comparison
          </Link>
        </p>
      </div>
    </section>
  );
}
