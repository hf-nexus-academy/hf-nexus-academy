import type { Metadata } from "next";
import { PricingCards } from "@/components/shared/pricing-cards";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Transparent monthly pricing for HF Nexus Academy courses. Starter, Standard, and Premium plans available in USD, GBP, and EUR.",
  alternates: { canonical: "/pricing" },
};

const PRICING_FAQS = [
  {
    question: "Can I change plans later?",
    answer:
      "Yes, you can upgrade or downgrade your plan at any time from your student dashboard. Changes take effect at the start of your next billing cycle.",
  },
  {
    question: "Is there a long-term contract?",
    answer:
      "No. All plans are billed monthly with no long-term commitment. You can cancel anytime from your account settings.",
  },
  {
    question: "Do you offer family or sibling discounts?",
    answer:
      "Yes, families enrolling multiple children can contact our admissions team for custom pricing arrangements.",
  },
  {
    question: "What payment methods are accepted?",
    answer:
      "We accept all major credit and debit cards via Stripe, as well as PayPal, in USD, GBP, or EUR.",
  },
];

export default function PricingPage() {
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
          <PricingCards />
        </div>
      </section>

      <section className="bg-cream-100 py-16 lg:py-20">
        <div className="container max-w-2xl">
          <h2 className="font-display text-2xl text-navy-950 mb-6 text-center">Pricing FAQ</h2>
          <Accordion type="single" collapsible>
            {PRICING_FAQS.map((faq) => (
              <AccordionItem key={faq.question} value={faq.question}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  );
}
