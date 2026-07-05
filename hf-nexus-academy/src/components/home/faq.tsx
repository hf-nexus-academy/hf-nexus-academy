import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { prisma } from "@/lib/prisma";

export async function Faq() {
  const faqs = await prisma.faq.findMany({
    where: { isPublished: true, placement: "general" },
    orderBy: { displayOrder: "asc" },
  });

  if (faqs.length === 0) return null;

  return (
    <section className="bg-cream-50 py-20 lg:py-28">
      <div className="container max-w-3xl">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-[0.2em] text-gold-600 font-medium">
            Frequently Asked Questions
          </span>
          <h2 className="font-display text-3xl lg:text-4xl text-navy-950 mt-3">
            Have questions? We have answers
          </h2>
        </div>

        <Accordion type="single" collapsible>
          {faqs.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* FAQPage schema markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })),
          }),
        }}
      />
    </section>
  );
}
