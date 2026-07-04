import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { CATEGORY_META } from "@/lib/courses-data";
import { getPublishedCourses } from "@/lib/data/public";

export const metadata: Metadata = {
  title: "Courses",
  description:
    "Explore HF Nexus Academy's course tracks in Quran, Hadith, Fiqh, Arabic Language, and Logic (Mantiq) — live online classes taught by qualified scholars.",
  alternates: { canonical: "/courses" },
};

export const revalidate = 60;

const CATEGORIES = Object.keys(CATEGORY_META);

export default async function CoursesIndexPage() {
  const courses = await getPublishedCourses();
  const countsByCategory: Record<string, number> = {};
  for (const course of courses) {
    const key = course.category.toLowerCase();
    countsByCategory[key] = (countsByCategory[key] ?? 0) + 1;
  }

  return (
    <div>
      <section className="bg-navy-950 py-20 lg:py-24">
        <div className="container max-w-3xl text-center">
          <span className="text-xs uppercase tracking-[0.2em] text-gold-500 font-medium">
            All Courses
          </span>
          <h1 className="font-display text-4xl lg:text-5xl text-cream-50 mt-4 text-balance">
            Structured Islamic education, taught live
          </h1>
          <p className="mt-6 text-cream-50/70 leading-relaxed">
            Choose a course track below to see the full curriculum, teacher, and
            class structure for each discipline.
          </p>
        </div>
      </section>

      <section className="bg-cream-50 py-16 lg:py-20">
        <div className="container flex flex-col gap-6">
          {CATEGORIES.map((cat) => {
            const meta = CATEGORY_META[cat];
            const courseCount = countsByCategory[cat] ?? 0;
            return (
              <Link
                key={cat}
                href={`/courses/${cat}`}
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg border border-ink-300/15 bg-white p-7 hover:border-gold-500/40 hover:shadow-md transition-all"
              >
                <div>
                  <h2 className="font-display text-xl text-navy-950 mb-1.5">{meta.title}</h2>
                  <p className="text-sm text-ink-500 max-w-xl">{meta.description}</p>
                  <p className="text-xs text-gold-700 mt-2 font-medium">{courseCount} courses available</p>
                </div>
                <ArrowUpRight className="h-5 w-5 text-gold-600 shrink-0 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
