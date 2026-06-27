import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "HF Nexus Academy's privacy policy explaining how we collect, use, and protect your personal information.",
  alternates: { canonical: "/privacy-policy" },
  robots: { index: true, follow: true },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-cream-50 py-16 lg:py-20">
      <div className="container max-w-2xl">
        <h1 className="font-display text-3xl lg:text-4xl text-navy-950 mb-3">Privacy Policy</h1>
        <p className="text-sm text-ink-500 mb-10">Last updated: June 2026</p>

        <div className="flex flex-col gap-8 text-ink-700 leading-relaxed text-sm">
          <section>
            <h2 className="font-display text-xl text-navy-950 mb-3">1. Introduction</h2>
            <p>
              HF Nexus Academy (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates the website
              hf-nexus.com and related online learning services (collectively, the
              &quot;Service&quot;). This Privacy Policy explains how we collect, use, disclose,
              and safeguard your information when you use our Service.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-navy-950 mb-3">2. Information We Collect</h2>
            <p className="mb-3">We may collect the following categories of information:</p>
            <ul className="list-disc pl-5 flex flex-col gap-2">
              <li><strong>Account information:</strong> name, email address, password (hashed), country, and WhatsApp number.</li>
              <li><strong>Profile information:</strong> age, guardian name (for minors), course progress, and learning history.</li>
              <li><strong>Payment information:</strong> processed securely through Stripe and PayPal; we do not store full card numbers on our servers.</li>
              <li><strong>Usage data:</strong> pages visited, features used, and class attendance records.</li>
              <li><strong>Communications:</strong> messages sent via our contact form, free trial requests, and support correspondence.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl text-navy-950 mb-3">3. How We Use Your Information</h2>
            <p>We use collected information to: provide and maintain the Service; process enrollments and payments; communicate with you about classes, assignments, and account matters; improve our courses and platform; and comply with legal obligations.</p>
          </section>

          <section>
            <h2 className="font-display text-xl text-navy-950 mb-3">4. Data Sharing</h2>
            <p>
              We do not sell personal information. We may share data with trusted
              service providers (e.g. payment processors, email delivery services)
              strictly to operate the Service, and only to the extent necessary for
              them to perform their functions.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-navy-950 mb-3">5. Children&apos;s Privacy</h2>
            <p>
              Our Service is used by students of various ages, including minors,
              typically under a parent or guardian&apos;s account and supervision. We
              collect only the information necessary to provide educational services
              and recommend that a parent or guardian manage account details for
              students under 18.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-navy-950 mb-3">6. Data Security</h2>
            <p>
              We implement industry-standard safeguards including password hashing,
              encrypted connections, and access controls to protect your information.
              However, no method of transmission over the internet is completely secure.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-navy-950 mb-3">7. Your Rights</h2>
            <p>
              Depending on your location, you may have rights to access, correct, or
              delete your personal information. To exercise these rights, contact us
              at admissions@hf-nexus.com.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-navy-950 mb-3">8. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Changes will be
              posted on this page with an updated revision date.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-navy-950 mb-3">9. Contact Us</h2>
            <p>
              For questions about this Privacy Policy, contact us at{" "}
              <a href="mailto:admissions@hf-nexus.com" className="text-gold-700 hover:underline">admissions@hf-nexus.com</a>.
            </p>
          </section>

          <p className="text-xs text-ink-300 border-t border-ink-300/20 pt-6">
            This document is a general template and should be reviewed by a qualified
            legal professional before use in production, to ensure compliance with
            applicable laws (e.g. GDPR, CCPA) in the jurisdictions you operate in.
          </p>
        </div>
      </div>
    </div>
  );
}
