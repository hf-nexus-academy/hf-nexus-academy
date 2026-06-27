"use client";

import { motion } from "framer-motion";

const STEPS = [
  {
    label: "Book a Free Trial",
    description: "Tell us your goals and schedule a no-cost trial class with a qualified teacher.",
  },
  {
    label: "Meet Your Teacher",
    description: "Experience a live class and get a personalized learning plan suited to your level.",
  },
  {
    label: "Begin Structured Study",
    description: "Start regular live classes with assignments, attendance tracking, and resources.",
  },
  {
    label: "Track Your Progress",
    description: "Follow your progress through your student dashboard, with certificates upon completion.",
  },
];

export function StudentJourney() {
  return (
    <section className="bg-cream-50 py-20 lg:py-28">
      <div className="container">
        <div className="max-w-2xl mb-16">
          <span className="text-xs uppercase tracking-[0.2em] text-gold-600 font-medium">
            The Student Journey
          </span>
          <h2 className="font-display text-3xl lg:text-4xl text-navy-950 mt-3 text-balance">
            A clear path, like a sanad — each step connected to the next
          </h2>
        </div>

        <div className="relative grid sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative pl-2 ${i !== 0 ? "first:sanad-link-hidden:before sanad-link" : ""}`}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-gold-500 font-display text-sm text-gold-700">
                  {i + 1}
                </span>
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block h-px flex-1 bg-gradient-to-r from-gold-500/50 to-transparent" />
                )}
              </div>
              <h3 className="font-display text-lg text-navy-950 mb-2">{step.label}</h3>
              <p className="text-sm text-ink-500 leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
