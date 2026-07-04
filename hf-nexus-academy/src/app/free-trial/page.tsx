import type { Metadata } from "next";
import { Suspense } from "react";
import { CalendarClock } from "lucide-react";

import { FreeTrialForm } from "@/components/forms/free-trial-form";

export const metadata: Metadata = {
  title: "Book a Free Trial Class",
  description:
    "Book a free trial class with HF Nexus Academy. Tell us your goals and we'll match you with a qualified scholar for your course of interest.",
  alternates: { canonical: "/free-trial" },
};

export default function FreeTrialPage() {
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL || "";

  return (
    <div className="bg-cream-50">
      <section className="bg-navy-950 py-20 lg:py-24">
        <div className="container max-w-2xl text-center">
          <span className="text-xs uppercase tracking-[0.2em] text-gold-500 font-medium">
            Free Trial Class
          </span>
          <h1 className="font-display text-4xl lg:text-5xl text-cream-50 mt-4 text-balance">
            Experience HF Nexus Academy, free of charge
          </h1>
          <p className="mt-6 text-cream-50/70 leading-relaxed">
            Tell us a little about yourself and we&apos;ll schedule a free trial
            class with one of our qualified scholars — no payment required.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="container max-w-2xl">
          <div className="rounded-xl border border-ink-300/15 bg-white p-7 sm:p-10 shadow-sm">
            <Suspense>
              <FreeTrialForm />
            </Suspense>
          </div>

          {/* Calendly booking placeholder, per brief: "Integrate Calendly placeholders" */}
          <div className="mt-10 rounded-xl border border-dashed border-gold-500/30 bg-gold-50/40 p-7 text-center">
            <CalendarClock className="h-7 w-7 text-gold-600 mx-auto mb-3" />
            <h3 className="font-display text-lg text-navy-950 mb-2">
              Prefer to pick a time yourself?
            </h3>
            <p className="text-sm text-ink-500 mb-4 max-w-md mx-auto">
              Once configured, students will be able to choose an exact class time
              directly via our Calendly scheduler below.
            </p>
            {calendlyUrl ? (
              <a
                href={calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-gold-700 hover:underline"
              >
                Open Scheduling Page →
              </a>
            ) : (
              <p className="text-xs text-ink-300">
                Calendly link not yet configured. Set NEXT_PUBLIC_CALENDLY_URL in your environment.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
