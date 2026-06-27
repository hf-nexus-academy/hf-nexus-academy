import type { Metadata } from "next";
import { Mail, MapPin } from "lucide-react";
import { FaWhatsapp, FaFacebookF, FaInstagram, FaYoutube, FaTiktok } from "react-icons/fa";

import { ContactForm } from "@/components/forms/contact-form";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with HF Nexus Academy via WhatsApp, email, or our contact form. We're here to help with enrollment, courses, and support.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";

  return (
    <div>
      <section className="bg-navy-950 py-20 lg:py-24">
        <div className="container max-w-2xl text-center">
          <span className="text-xs uppercase tracking-[0.2em] text-gold-500 font-medium">Contact Us</span>
          <h1 className="font-display text-4xl lg:text-5xl text-cream-50 mt-4 text-balance">
            We&apos;d love to hear from you
          </h1>
          <p className="mt-6 text-cream-50/70 leading-relaxed">
            Questions about courses, pricing, or enrollment? Reach out and our team
            will respond promptly.
          </p>
        </div>
      </section>

      <section className="bg-cream-50 py-16 lg:py-20">
        <div className="container grid lg:grid-cols-[1fr_1.2fr] gap-10">
          <div className="flex flex-col gap-6">
            <a
              href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-lg border border-ink-300/15 bg-white p-6 hover:border-[#25D366]/40 hover:shadow-sm transition-all"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366]/10 text-[#25D366]">
                <FaWhatsapp className="h-5 w-5" />
              </div>
              <div>
                <p className="font-display text-base text-navy-950">WhatsApp</p>
                <p className="text-sm text-ink-500">Chat with our admissions team</p>
              </div>
            </a>

            <a
              href="mailto:admissions@hf-nexus.com"
              className="flex items-center gap-4 rounded-lg border border-ink-300/15 bg-white p-6 hover:border-gold-500/40 hover:shadow-sm transition-all"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gold-100 text-gold-700">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="font-display text-base text-navy-950">Email</p>
                <p className="text-sm text-ink-500">admissions@hf-nexus.com</p>
              </div>
            </a>

            <div className="flex items-center gap-4 rounded-lg border border-ink-300/15 bg-white p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-navy-950/5 text-navy-950">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="font-display text-base text-navy-950">Worldwide, Online</p>
                <p className="text-sm text-ink-500">Serving students across 17+ countries</p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              {[FaFacebookF, FaInstagram, FaYoutube, FaTiktok].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social media link"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-ink-300/20 text-navy-950 hover:bg-navy-950 hover:text-gold-400 transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>

            {/* Google Maps placeholder */}
            <div className="rounded-lg overflow-hidden border border-ink-300/15 bg-ink-300/10 h-48 flex items-center justify-center">
              <p className="text-xs text-ink-500">Map placeholder — embed Google Maps once a physical location is configured</p>
            </div>
          </div>

          <div className="rounded-xl border border-ink-300/15 bg-white p-7 sm:p-10 shadow-sm">
            <h2 className="font-display text-2xl text-navy-950 mb-6">Send a Message</h2>
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
