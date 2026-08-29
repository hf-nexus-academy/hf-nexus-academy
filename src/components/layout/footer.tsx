import Link from "next/link";
import { FaFacebookF, FaInstagram, FaYoutube, FaTiktok } from "react-icons/fa";
import { Mail, MapPin } from "lucide-react";

import { getSiteSettings } from "@/lib/data/admin";

const FOOTER_COLUMNS = [
  {
    title: "Courses",
    links: [
      { label: "Quran", href: "/courses/quran" },
      { label: "Hadith", href: "/courses/hadith" },
      { label: "Fiqh", href: "/courses/fiqh" },
      { label: "Arabic Language", href: "/courses/arabic" },
      { label: "Aqeedah", href: "/courses/aqeedah" },
      { label: "Logic (Mantiq)", href: "/courses/logic" },
    ],
  },
  {
    title: "Academy",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Our Teachers", href: "/teachers" },
      { label: "Blog", href: "/blog" },
      { label: "Free Trial", href: "/free-trial" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "Student Portal", href: "/student" },
      { label: "Teacher Portal", href: "/teacher" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms & Conditions", href: "/terms" },
    ],
  },
];

export async function Footer() {
  const year = new Date().getFullYear();
  const settings = await getSiteSettings();

  const socialLinks = [
    { Icon: FaFacebookF, url: settings.facebookUrl },
    { Icon: FaInstagram, url: settings.instagramUrl },
    { Icon: FaYoutube, url: settings.youtubeUrl },
    { Icon: FaTiktok, url: settings.tiktokUrl },
  ].filter((s) => s.url);

  const tagline =
    settings.footerTagline ||
    "A premium online Islamic education platform offering live, scholar-led classes in Quran, Hadith, Fiqh, Arabic, and classical Islamic sciences for students worldwide.";
  const contactEmail = settings.contactEmail || "admissions@hf-nexus.com";

  return (
    <footer className="bg-navy-950 text-cream-50/80 border-t border-white/10">
      <div className="container py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-2">
          <span className="font-display text-2xl text-cream-50">
            HF Nexus <span className="text-gold-500">Academy</span>
          </span>
          <p className="mt-4 text-sm leading-relaxed max-w-sm text-cream-50/60">{tagline}</p>
          {socialLinks.length > 0 && (
            <div className="flex items-center gap-3 mt-6">
              {socialLinks.map(({ Icon, url }, i) => (
                <a
                  key={i}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Social media link"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-cream-50/70 hover:bg-gold-500 hover:text-navy-950 hover:border-gold-500 transition-colors"
                >
                  <Icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          )}
        </div>

        {FOOTER_COLUMNS.map((col) => (
          <div key={col.title}>
            <h4 className="font-display text-sm text-gold-500 tracking-wide uppercase mb-4">
              {col.title}
            </h4>
            <ul className="flex flex-col gap-2.5">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-cream-50/65 hover:text-gold-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h4 className="font-display text-sm text-gold-500 tracking-wide uppercase mb-4">
            Get in Touch
          </h4>
          <ul className="flex flex-col gap-3 text-sm text-cream-50/65">
            <li className="flex items-start gap-2">
              <Mail className="h-4 w-4 mt-0.5 shrink-0 text-gold-500" />
              <span>{contactEmail}</span>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-gold-500" />
              <span>Serving students worldwide, online</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-cream-50/50">
          <p>© {year} HF Nexus Academy. All rights reserved.</p>
          <p>hf-nexus.com</p>
        </div>
      </div>
    </footer>
  );
}
