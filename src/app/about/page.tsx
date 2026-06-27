import type { Metadata } from "next";
import { BookOpen, Globe2, ShieldCheck, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "HF Nexus Academy is a premium online Islamic education platform serving students worldwide with live classes in Quran, Hadith, Fiqh, Arabic, and classical Islamic sciences.",
  alternates: { canonical: "/about" },
};

const VALUES = [
  {
    icon: BookOpen,
    title: "Authenticity First",
    description:
      "Every course is grounded in classical texts and traditional methodology, taught faithfully by qualified scholars.",
  },
  {
    icon: Globe2,
    title: "Borderless Education",
    description:
      "We built HF Nexus Academy to remove geography as a barrier to quality Islamic education, serving students across 17+ countries.",
  },
  {
    icon: ShieldCheck,
    title: "Trust & Transparency",
    description:
      "From clear pricing to structured progress tracking, students and parents always know exactly what to expect.",
  },
  {
    icon: Sparkles,
    title: "Excellence in Delivery",
    description:
      "We invest in teaching quality, platform reliability, and student support — not just course content.",
  },
];

export default function AboutPage() {
  return (
    <div>
      <section className="bg-navy-950 py-20 lg:py-24">
        <div className="container max-w-3xl text-center">
          <span className="text-xs uppercase tracking-[0.2em] text-gold-500 font-medium">About HF Nexus Academy</span>
          <h1 className="font-display text-4xl lg:text-5xl text-cream-50 mt-4 text-balance">
            A premium Islamic learning institution, built for the world
          </h1>
          <p className="mt-6 text-cream-50/70 leading-relaxed">
            HF Nexus Academy was founded to bring structured, scholar-led Islamic
            education to students wherever they live — combining classical
            methodology with the flexibility of modern online learning.
          </p>
        </div>
      </section>

      <section className="bg-cream-50 py-20 lg:py-24">
        <div className="container grid lg:grid-cols-2 gap-14 items-start">
          <div>
            <h2 className="font-display text-3xl text-navy-950 mb-5">Our Mission</h2>
            <p className="text-ink-500 leading-relaxed mb-5">
              We exist to make authentic, structured Islamic education accessible to
              students across the United States, United Kingdom, Canada, Australia,
              Europe, and the Gulf — regardless of timezone or location. Our scholars
              bring traditional knowledge of Quran, Hadith, Fiqh, Arabic, Aqeedah, and
              Logic into a live, interactive classroom that meets students where they are.
            </p>
            <p className="text-ink-500 leading-relaxed">
              HF Nexus Academy is not a casual Quran tutoring service — it is a
              structured academy, built around curriculum, progress tracking, and
              accountability, the way a serious institution of learning should be.
            </p>
          </div>
          <div>
            <h2 className="font-display text-3xl text-navy-950 mb-5">Our Approach</h2>
            <p className="text-ink-500 leading-relaxed mb-5">
              Every course follows a defined syllabus taught by a dedicated scholar,
              with small class sizes that allow for real interaction and feedback.
              Students track their progress, complete assignments, and build toward
              certificates of completion — just as they would at an in-person academy.
            </p>
            <p className="text-ink-500 leading-relaxed">
              We continue to expand our course offerings and teaching team to serve a
              growing global student body, while staying committed to the same
              standard of authenticity in every class we teach.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-cream-100 py-20 lg:py-24">
        <div className="container">
          <h2 className="font-display text-3xl text-navy-950 mb-12 text-center">What We Stand For</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((value) => (
              <div key={value.title} className="rounded-lg bg-white border border-ink-300/15 p-7">
                <div className="flex h-11 w-11 items-center justify-center rounded-md bg-navy-950 text-gold-400 mb-5">
                  <value.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-base text-navy-950 mb-2">{value.title}</h3>
                <p className="text-sm text-ink-500 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
