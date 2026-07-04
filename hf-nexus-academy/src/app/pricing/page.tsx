import type { Metadata } from "next";
import { PricingCards, type PricingPlanDisplay } from "@/components/shared/pricing-cards";
import { Faq } from "@/components/home/faq";
import { getPublishedPricingPlans } from "@/lib/data/public";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Transparent monthly pricing for HF Nexus Academy courses. Starter, Standard, and Premium plans available in USD, GBP, and EUR.",
  alternates: { canonical: "/pricing" },
};

export const revalidate = 60;

export default async function PricingPage() {
  const dbPlans = await getPublishedPricingPlans();
  const plans: PricingPlanDisplay[] = dbPlans.map((p) => ({
    key: p.key,
    name: p.name,
    description: p.description,
    priceMonthlyCents: { USD: p.priceUSDCents, GBP: p.priceGBPCents, EUR: p.priceEURCents },
    features: p.features,
    highlighted: p.isHighlighted,
  }));

  return (
    <div>
      <section className="bg-navy-950 py-20 lg:py-24">
        <div className="container max-w-3xl text-center">
          <span className="text-xs uppercase tracking-[0.2em] text-gold-500 font-medium">Pricing</span>
          <h1 className="font-display text-4xl lg:text-5xl text-cream-50 mt-4 text-balance">
            Simple, transparent pricing
          </h1>
          <p className="mt-6 text-cream-50/70 leading-relaxed">
            Choose the plan that fits your learning goals. All plans include live
            classes with a qualified scholar — no hidden fees.
          </p>
        </div>
      </section>

      <section className="bg-cream-50 py-16 lg:py-20">
        <div className="container">
          <PricingCards plans={plans} />
        </div>
      </section>

      <Faq placement="pricing" />
    </div>
  );
}
