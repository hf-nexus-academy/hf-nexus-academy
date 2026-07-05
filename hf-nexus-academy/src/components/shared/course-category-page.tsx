import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { CourseCard } from "@/components/shared/course-card";
import { TeacherCard } from "@/components/shared/teacher-card";
import { Button } from "@/components/ui/button";
import { COURSES_BY_CATEGORY, CATEGORY_META } from "@/lib/courses-data";
import { TEACHERS } from "@/lib/teachers-data";

export function CourseCategoryPage({ category }: { category: string }) {
  const courses = COURSES_BY_CATEGORY[category] ?? [];
  const meta = CATEGORY_META[category];
  const teacher = TEACHERS.find((t) => t.slug === meta.teacherSlug);

  const courseListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: courses.map((course, i) => ({
      "@type": "Course",
      position: i + 1,
      name: course.title,
      description: course.subtitle,
      provider: {
        "@type": "EducationalOrganization",
        name: "HF Nexus Academy",
        sameAs: "https://hf-nexus.com",
      },
      hasCourseInstance: {
        "@type": "CourseInstance",
        courseMode: "online",
        courseWorkload: `PT${course.durationWeeks}W`,
        location: {
          "@type": "VirtualLocation",
          url: "https://hf-nexus.com",
        },
      },
      ...(course.priceMonthlyUSD
        ? {
            offers: {
              "@type": "Offer",
              price: course.priceMonthlyUSD,
              priceCurrency: "USD",
              category: "Subscription",
            },
          }
        : {}),
    })),
  };

  return (
    <div>
      <section className="bg-navy-950 py-20 lg:py-24">
        <div className="container max-w-3xl text-center">
          <span className="text-xs uppercase tracking-[0.2em] text-gold-500 font-medium">Course Track</span>
          <h1 className="font-display text-4xl lg:text-5xl text-cream-50 mt-4 text-balance">
            {meta.title}
          </h1>
          <p className="mt-6 text-cream-50/70 leading-relaxed">{meta.description}</p>
        </div>
      </section>

      <section className="bg-cream-50 py-16 lg:py-20">
        <div className="container">
          <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {courses.map((course) => (
              <CourseCard key={course.slug} course={course} />
            ))}
          </div>
        </div>
      </section>

      {teacher && (
        <section className="bg-cream-100 py-16 lg:py-20">
          <div className="container max-w-2xl">
            <h2 className="font-display text-2xl text-navy-950 mb-6 text-center">
              Taught By
            </h2>
            <TeacherCard teacher={teacher} />
          </div>
        </section>
      )}

      <section className="bg-navy-950 py-16">
        <div className="container text-center">
          <h2 className="font-display text-2xl lg:text-3xl text-cream-50 mb-6">
            Ready to begin {meta.title.toLowerCase()}?
          </h2>
          <Button asChild size="lg" variant="gold">
            <Link href="/free-trial">
              Book Free Trial <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseListSchema) }}
      />
    </div>
  );
}
