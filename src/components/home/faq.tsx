import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

const FAQS = [
  {
    question: "How do live online classes work?",
    answer:
      "Classes are conducted live through video conferencing, with your teacher guiding the session in real time. You can ask questions, get immediate feedback, and interact directly — just like an in-person class, but from anywhere in the world.",
  },
  {
    question: "What age groups do you teach?",
    answer:
      "We teach students of all ages, from young children beginning their Quran journey to adults studying Fiqh, Hadith, or Arabic. Class pacing and teaching style are adjusted to the student's age and level.",
  },
  {
    question: "Do I need any prior knowledge to start?",
    answer:
      "No prior knowledge is required for our beginner-level courses. Our teachers assess your current level during the free trial class and build a learning plan suited to where you're starting from.",
  },
  {
    question: "What if the class timing doesn't suit my timezone?",
    answer:
      "We serve students across many timezones and offer flexible scheduling. During your free trial booking, you can specify your preferred times and we'll match you with a suitable class slot.",
  },
  {
    question: "Can I switch teachers or courses later?",
    answer:
      "Yes. If you feel another teacher or course track would suit you better, simply reach out to our support team and we'll help arrange the change.",
  },
  {
    question: "How do I pay, and which currencies are supported?",
    answer:
      "We accept payments via Stripe and PayPal, with pricing available in USD, GBP, and EUR. You can manage your subscription and billing history from your student dashboard.",
  },
];

export function Faq() {
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
          {FAQS.map((faq) => (
            <AccordionItem key={faq.question} value={faq.question}>
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
            mainEntity: FAQS.map((faq) => ({
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
