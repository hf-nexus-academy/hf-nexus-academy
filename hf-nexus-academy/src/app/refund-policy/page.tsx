import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "HF Nexus Academy's refund policy for course subscriptions and payments.",
  alternates: { canonical: "/refund-policy" },
};

export default function RefundPolicyPage() {
  return (
    <div className="bg-cream-50 py-16 lg:py-20">
      <div className="container max-w-2xl">
        <h1 className="font-display text-3xl lg:text-4xl text-navy-950 mb-3">Refund Policy</h1>
        <p className="text-sm text-ink-500 mb-10">Last updated: June 2026</p>

        <div className="flex flex-col gap-8 text-ink-700 leading-relaxed text-sm">
          <section>
            <h2 className="font-display text-xl text-navy-950 mb-3">1. Free Trial</h2>
            <p>
              HF Nexus Academy offers a free trial class for new students at no cost.
              No payment is required to book or attend a free trial, and no refund
              is applicable since no charge is made.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-navy-950 mb-3">2. Monthly Subscriptions</h2>
            <p>
              Subscriptions are billed monthly in advance. If you cancel your
              subscription, you will retain access until the end of your current
              billing period, but no partial refund will be issued for unused time
              within that period unless required by applicable law.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-navy-950 mb-3">3. Refund Eligibility</h2>
            <p className="mb-3">You may be eligible for a refund if:</p>
            <ul className="list-disc pl-5 flex flex-col gap-2">
              <li>You were charged in error or charged twice for the same billing period.</li>
              <li>A technical issue on our end prevented you from accessing classes you paid for, and the issue was not resolved within a reasonable time.</li>
              <li>You request cancellation within 48 hours of your first paid charge and have not yet attended a paid class.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl text-navy-950 mb-3">4. Non-Refundable Circumstances</h2>
            <p>
              Refunds will generally not be issued for missed classes due to the
              student&apos;s own scheduling conflicts, dissatisfaction after
              substantial use of the service within a billing period, or violations
              of our Terms &amp; Conditions resulting in account suspension.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-navy-950 mb-3">5. How to Request a Refund</h2>
            <p>
              To request a refund, contact our support team at{" "}
              <a href="mailto:admissions@hf-nexus.com" className="text-gold-700 hover:underline">admissions@hf-nexus.com</a>{" "}
              with your account email and the reason for your request. We aim to
              respond within 3–5 business days.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-navy-950 mb-3">6. Processing Time</h2>
            <p>
              Approved refunds will be processed back to you using the same
              method you originally paid with, within 5–10 business days.
            </p>
          </section>

          <p className="text-xs text-ink-300 border-t border-ink-300/20 pt-6">
            This document is a general template and should be reviewed by a qualified
            legal professional before use in production, particularly regarding
            consumer protection laws in the regions you serve.
          </p>
        </div>
      </div>
    </div>
  );
}
