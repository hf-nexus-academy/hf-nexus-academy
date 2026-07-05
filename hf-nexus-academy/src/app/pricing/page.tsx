import type { Metadata } from "next";
import { PricingCards } from "@/components/shared/pricing-cards";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Transparent monthly pricing for HF Nexus Academy courses. Starter, Standard, and Premium plans available in USD, GBP, and EUR.",
  alternates: { canonical: "/pricing" },
};

export default async function PricingPage() {
  const [plans, faqs] = await Promise.all([
    prisma.pricingPlan.findMany({ where: { isPublished: true }, orderBy: { displayOrder: "asc" } }),
    prisma.faq.findMany({
      where: { isPublished: true, placement: "pricing" },
      orderBy: { displayOrder: "asc" },
    }),
  ]);

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

      {faqs.length > 0 && (
        <section className="bg-cream-100 py-16 lg:py-20">
          <div className="container max-w-2xl">
            <h2 className="font-display text-2xl text-navy-950 mb-6 text-center">Pricing FAQ</h2>
            <Accordion type="single" collapsible>
              {faqs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      )}
    </div>
  );
}
