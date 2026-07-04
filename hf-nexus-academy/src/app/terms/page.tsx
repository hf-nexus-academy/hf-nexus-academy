import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms and conditions governing use of HF Nexus Academy's services.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <div className="bg-cream-50 py-16 lg:py-20">
      <div className="container max-w-2xl">
        <h1 className="font-display text-3xl lg:text-4xl text-navy-950 mb-3">Terms &amp; Conditions</h1>
        <p className="text-sm text-ink-500 mb-10">Last updated: June 2026</p>

        <div className="flex flex-col gap-8 text-ink-700 leading-relaxed text-sm">
          <section>
            <h2 className="font-display text-xl text-navy-950 mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using HF Nexus Academy&apos;s website and services
              (the &quot;Service&quot;), you agree to be bound by these Terms &amp;
              Conditions. If you do not agree, please do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-navy-950 mb-3">2. Enrollment and Accounts</h2>
            <p>
              To access courses, you must create an account with accurate information.
              You are responsible for maintaining the confidentiality of your login
              credentials and for all activity under your account. Students under 18
              should have a parent or guardian manage their account.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-navy-950 mb-3">3. Course Access and Conduct</h2>
            <p>
              Access to live classes, recorded lessons, and learning materials is
              granted based on your active subscription plan. Students are expected
              to attend classes punctually, treat teachers and fellow students with
              respect, and refrain from recording or redistributing class content
              without permission.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-navy-950 mb-3">4. Payments and Subscriptions</h2>
            <p>
              Subscriptions are billed monthly in advance via Stripe or PayPal.
              Prices are displayed in USD, GBP, or EUR depending on your selection.
              You may cancel your subscription at any time; cancellation will take
              effect at the end of the current billing period. See our{" "}
              <a href="/refund-policy" className="text-gold-700 hover:underline">Refund Policy</a> for details on refund eligibility.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-navy-950 mb-3">5. Intellectual Property</h2>
            <p>
              All course materials, videos, and content provided through the Service
              are the intellectual property of HF Nexus Academy or its licensors.
              Students may not copy, distribute, or resell course materials without
              written permission.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-navy-950 mb-3">6. Termination</h2>
            <p>
              We reserve the right to suspend or terminate accounts that violate
              these Terms, engage in abusive conduct, or misuse the Service.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-navy-950 mb-3">7. Limitation of Liability</h2>
            <p>
              The Service is provided &quot;as is&quot; without warranties of any
              kind. HF Nexus Academy shall not be liable for indirect, incidental,
              or consequential damages arising from use of the Service, to the
              fullest extent permitted by law.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-navy-950 mb-3">8. Changes to These Terms</h2>
            <p>
              We may update these Terms from time to time. Continued use of the
              Service after changes constitutes acceptance of the revised Terms.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-navy-950 mb-3">9. Contact Us</h2>
            <p>
              For questions about these Terms, contact us at{" "}
              <a href="mailto:admissions@hf-nexus.com" className="text-gold-700 hover:underline">admissions@hf-nexus.com</a>.
            </p>
          </section>

          <p className="text-xs text-ink-300 border-t border-ink-300/20 pt-6">
            This document is a general template and should be reviewed by a qualified
            legal professional before use in production.
          </p>
        </div>
      </div>
    </div>
  );
}
