import Link from "next/link";
import { Clock, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface CourseCardData {
  slug: string;
  title: string;
  subtitle: string;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  durationWeeks: number;
  /** Set only for individually-priced courses (e.g. Qudoori, Hidayah) sold outside the standard subscription plans. */
  priceMonthlyUSD?: number;
}

const LEVEL_LABELS: Record<string, string> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
};

export function CourseCard({ course }: { course: CourseCardData }) {
  return (
    <Link
      href={`/courses/${course.slug}/enroll`}
      className="group flex flex-col rounded-lg border border-ink-300/15 bg-white p-6 hover:border-gold-500/40 hover:shadow-md transition-all"
    >
      <div className="flex items-center justify-between mb-3">
        <Badge variant="outline">{LEVEL_LABELS[course.level]}</Badge>
        {course.priceMonthlyUSD && (
          <span className="font-display text-base text-gold-700">
            ${course.priceMonthlyUSD}<span className="text-xs text-ink-500">/mo</span>
          </span>
        )}
      </div>
      <h3 className="font-display text-lg text-navy-950 mb-2">{course.title}</h3>
      <p className="text-sm text-ink-500 leading-relaxed mb-4 flex-1">{course.subtitle}</p>
      <div className="flex items-center gap-4 text-xs text-ink-500 mt-auto pt-4 border-t border-ink-300/10">
        <span className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" /> {course.durationWeeks} weeks
        </span>
        <span className="flex items-center gap-1.5">
          <BarChart3 className="h-3.5 w-3.5" /> {LEVEL_LABELS[course.level]}
        </span>
      </div>
    </Link>
  );
}
