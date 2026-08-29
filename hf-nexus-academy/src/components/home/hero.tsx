"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, PlayCircle } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

import { Button } from "@/components/ui/button";

export function Hero() {
  const whatsappNumber = "923142166677";

  return (
    <section className="relative overflow-hidden bg-navy-950">
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950 via-navy-950 to-navy-900" />

      <div className="container relative py-20 lg:py-28 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/10 px-4 py-1.5 text-xs font-medium tracking-wide text-gold-400 uppercase mb-6">
            Live Online Classes · Worldwide Enrollment
          </span>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.4rem] leading-[1.1] text-cream-50 text-balance">
            Online Quran, Hadith, Fiqh &amp; Arabic Classes for Students Worldwide
          </h1>

          <p className="mt-6 text-lg text-cream-50/70 max-w-xl leading-relaxed">
            Learn authentic Islamic knowledge through live online classes taught by
            qualified scholars — structured, personalized, and built for students in
            every timezone.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Button asChild size="lg" variant="gold">
              <Link href="/free-trial">
                Book Free Trial <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-cream-50/30 text-cream-50 hover:bg-cream-50 hover:text-navy-950">
              <Link href="/free-trial">Enroll Now</Link>
            </Button>
            <a
              href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-cream-50/80 hover:text-gold-400 transition-colors"
            >
              <FaWhatsapp className="h-5 w-5 text-[#25D366]" />
              WhatsApp Us
            </a>
          </div>

          <div className="mt-12 flex items-center gap-8 text-cream-50/60 text-sm">
            <div>
              <p className="font-display text-2xl text-gold-400">17+</p>
              <p>Countries served</p>
            </div>
            <div className="h-8 w-px bg-cream-50/15" />
            <div>
              <p className="font-display text-2xl text-gold-400">7</p>
              <p>Subjects taught</p>
            </div>
            <div className="h-8 w-px bg-cream-50/15" />
            <div>
              <p className="font-display text-2xl text-gold-400">3</p>
              <p>Qualified scholars</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
          className="relative hidden lg:block"
        >
          <SanadMotif />
        </motion.div>
      </div>
    </section>
  );
}

/**
 * The "sanad chain" motif — a visual reference to the Islamic scholarly
 * tradition of chains of transmission (sanad). Repeating arch silhouettes
 * connected by thin gold linework, rendered in pure SVG.
 */
function SanadMotif() {
  return (
    <svg viewBox="0 0 480 520" className="w-full h-auto" fill="none">
      {[0, 1, 2, 3].map((i) => {
        const y = 60 + i * 120;
        const x = 60 + (i % 2 === 0 ? 0 : 60);
        return (
          <g key={i}>
            <path
              d={`M ${x} ${y + 90} C ${x} ${y + 10}, ${x + 160} ${y + 10}, ${x + 160} ${y + 90}`}
              stroke={i === 1 ? "#C9A961" : "#E3CD96"}
              strokeOpacity={i === 1 ? 1 : 0.45}
              strokeWidth={i === 1 ? 2.5 : 1.5}
            />
            <circle cx={x} cy={y + 90} r={5} fill={i === 1 ? "#C9A961" : "#E3CD96"} fillOpacity={i === 1 ? 1 : 0.6} />
            <circle cx={x + 160} cy={y + 90} r={5} fill={i === 1 ? "#C9A961" : "#E3CD96"} fillOpacity={i === 1 ? 1 : 0.6} />
            {i < 3 && (
              <line
                x1={x + 160}
                y1={y + 90}
                x2={x + 60 + ((i + 1) % 2 === 0 ? 0 : 60)}
                y2={y + 90 + 30}
                stroke="#E3CD96"
                strokeOpacity={0.25}
                strokeWidth={1}
                strokeDasharray="4 4"
              />
            )}
          </g>
        );
      })}
      <text x="240" y="500" textAnchor="middle" fill="#E3CD96" fillOpacity="0.4" fontSize="13" letterSpacing="2">
        SANAD — CHAIN OF TRANSMISSION
      </text>
    </svg>
  );
}
