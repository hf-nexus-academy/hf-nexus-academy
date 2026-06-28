"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const CATEGORIES = [
  {
    slug: "quran",
    title: "Quran",
    description: "Nazirah, Tajweed, Hifz Support, Tafsir Basics",
  },
  {
    slug: "hadith",
    title: "Hadith",
    description: "Forty Hadith, Riyadh us Saliheen, Hadith Methodology",
  },
  {
    slug: "fiqh",
    title: "Fiqh",
    description: "Qudoori for beginners, Hidayah (4 Jilds) for advanced students",
  },
  {
    slug: "arabic",
    title: "Arabic Language",
    description: "Reading, Grammar, Vocabulary, Conversation",
  },
  {
    slug: "aqeedah",
    title: "Aqeedah",
    description: "Foundations, Sifat-e-Bari, Sharah Aqaid, Comparative Aqeedah",
  },
  {
    slug: "logic",
    title: "Logic (Mantiq)",
    description: "Introduction, Definitions, Reasoning, Classical Logic",
  },
];

export function CoursesOverview() {
  return (
    <section className="bg-navy-950 py-20 lg:py-28">
      <div className="container">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-14">
          <div className="max-w-xl">
            <span className="text-xs uppercase tracking-[0.2em] text-gold-500 font-medium">
              Course Tracks
            </span>
            <h2 className="font-display text-3xl lg:text-4xl text-cream-50 mt-3 text-balance">
              Five disciplines, taught the traditional way
            </h2>
          </div>
          <Link href="/courses" className="text-sm font-medium text-gold-400 hover:underline shrink-0">
            View all courses →
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-px bg-cream-50/10 rounded-lg overflow-hidden">
          {CATEGORIES.map((cat, i) => (
            <motion.div key={cat.slug} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
              <Link
                href={`/courses/${cat.slug}`}
                className="group flex h-full flex-col justify-between bg-navy-950 p-7 hover:bg-navy-900 transition-colors min-h-[220px]"
              >
                <div>
                  <h3 className="font-display text-xl text-cream-50 mb-2">{cat.title}</h3>
                  <p className="text-sm text-cream-50/55 leading-relaxed">{cat.description}</p>
                </div>
                <ArrowUpRight className="h-5 w-5 text-gold-500 mt-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
