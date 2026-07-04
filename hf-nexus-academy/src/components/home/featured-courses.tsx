import Link from "next/link";
import { CourseCard, type CourseCardData } from "@/components/shared/course-card";
import { getFeaturedCourses } from "@/lib/data/public";

export async function FeaturedCourses() {
  const dbCourses = await getFeaturedCourses(3);

  if (dbCourses.length === 0) return null;

  const courses: CourseCardData[] = dbCourses.map((c) => ({
    slug: c.slug,
    title: c.title,
    subtitle: c.subtitle ?? "",
    level: c.level,
    durationWeeks: c.durationWeeks ?? 0,
    priceMonthlyUSD: c.priceMonthlyCents ? Math.round(c.priceMonthlyCents / 100) : undefined,
  }));

  return (
    <section className="bg-cream-100 py-20 lg:py-28">
      <div className="container">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-14">
          <div className="max-w-xl">
            <span className="text-xs uppercase tracking-[0.2em] text-gold-600 font-medium">
              Featured Courses
            </span>
            <h2 className="font-display text-3xl lg:text-4xl text-navy-950 mt-3 text-balance">
              Recommended starting points
            </h2>
          </div>
          <Link href="/courses" className="text-sm font-medium text-gold-700 hover:underline shrink-0">
            Browse all courses →
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </div>
      </div>
    </section>
  );
}
