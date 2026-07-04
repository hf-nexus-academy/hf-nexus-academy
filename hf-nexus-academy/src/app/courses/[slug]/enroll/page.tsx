import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Clock, BarChart3, GraduationCap } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CheckoutButton } from "@/components/shared/checkout-button";
import { getPublishedCourseBySlug } from "@/lib/data/public";
import { formatCurrency, getInitials } from "@/lib/utils";
import { COURSE_CATEGORY_LABELS, COURSE_CATEGORY_SLUGS, type Currency } from "@/lib/constants";

export const revalidate = 60;

const LEVEL_LABELS: Record<string, string> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const course = await getPublishedCourseBySlug(slug);
  if (!course) return {};
  return {
    title: `Enroll — ${course.title}`,
    description: course.description,
    alternates: { canonical: `/courses/${course.slug}/enroll` },
  };
}

export default async function CourseEnrollPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = await getPublishedCourseBySlug(slug);
  if (!course) notFound();

  const teacherName = course.teacher?.user.name;
  const categorySlug = COURSE_CATEGORY_SLUGS[course.category] ?? course.category.toLowerCase();
  const lessonCount = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);

  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.description,
    provider: {
      "@type": "EducationalOrganization",
      name: "HF Nexus Academy",
      sameAs: "https://hf-nexus.com",
    },
    ...(course.priceMonthlyCents
      ? {
          offers: {
            "@type": "Offer",
            price: course.priceMonthlyCents / 100,
            priceCurrency: course.priceCurrency ?? "USD",
            category: "Subscription",
          },
        }
      : {}),
  };

  return (
    <div>
      <section className="bg-navy-950 py-16 lg:py-20">
        <div className="container max-w-3xl">
          <div className="flex items-center gap-2 mb-4">
            <Link href={`/courses/${categorySlug}`} className="text-xs text-gold-500 hover:underline">
              {COURSE_CATEGORY_LABELS[course.category] ?? course.category}
            </Link>
            <span className="text-cream-50/30">/</span>
            <Badge variant="outline" className="border-cream-50/20 text-cream-50/70">
              {LEVEL_LABELS[course.level]}
            </Badge>
          </div>
          <h1 className="font-display text-3xl lg:text-4xl text-cream-50 text-balance">{course.title}</h1>
          {course.subtitle && <p className="mt-3 text-cream-50/70 leading-relaxed">{course.subtitle}</p>}

          <div className="flex flex-wrap items-center gap-5 mt-6 text-sm text-cream-50/60">
            {course.durationWeeks && (
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-gold-500" /> {course.durationWeeks} weeks
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <BarChart3 className="h-4 w-4 text-gold-500" /> {LEVEL_LABELS[course.level]}
            </span>
            {teacherName && (
              <span className="flex items-center gap-1.5">
                <GraduationCap className="h-4 w-4 text-gold-500" /> {teacherName}
              </span>
            )}
          </div>
        </div>
      </section>

      <section className="bg-cream-50 py-16 lg:py-20">
        <div className="container max-w-3xl grid lg:grid-cols-[1.5fr_1fr] gap-10">
          <div className="flex flex-col gap-10">
            <div>
              <h2 className="font-display text-xl text-navy-950 mb-3">About This Course</h2>
              <p className="text-ink-500 leading-relaxed whitespace-pre-wrap">{course.description}</p>
            </div>

            {course.modules.length > 0 && (
              <div>
                <h2 className="font-display text-xl text-navy-950 mb-4">
                  Curriculum {lessonCount > 0 && `(${lessonCount} lessons)`}
                </h2>
                <div className="flex flex-col gap-3">
                  {course.modules.map((module) => (
                    <div key={module.id} className="rounded-lg border border-ink-300/15 bg-white overflow-hidden">
                      <div className="px-5 py-3 bg-cream-100 border-b border-ink-300/10">
                        <p className="text-sm font-medium text-navy-950">{module.title}</p>
                      </div>
                      {module.lessons.length > 0 && (
                        <div className="flex flex-col divide-y divide-ink-300/10">
                          {module.lessons.map((lesson) => (
                            <div key={lesson.id} className="flex items-center gap-2.5 px-5 py-3">
                              <CheckCircle2 className="h-3.5 w-3.5 text-gold-600 shrink-0" />
                              <span className="text-sm text-ink-700">{lesson.title}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {course.teacher && (
              <div>
                <h2 className="font-display text-xl text-navy-950 mb-4">Your Teacher</h2>
                <Link
                  href={`/teachers/${course.teacher.slug}`}
                  className="flex items-center gap-4 rounded-lg border border-ink-300/15 bg-white p-5 hover:border-gold-500/40 hover:shadow-sm transition-all"
                >
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>{getInitials(teacherName ?? "")}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-navy-950">
                      {course.teacher.title ? `${course.teacher.title} ` : ""}
                      {teacherName}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {course.teacher.specializations.slice(0, 3).map((s) => (
                        <Badge key={s} variant="gold">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Link>
              </div>
            )}
          </div>

          <div className="lg:sticky lg:top-24 h-fit">
            <div className="rounded-xl border border-ink-300/15 bg-white p-6 shadow-sm">
              {course.priceMonthlyCents ? (
                <>
                  <p className="font-display text-3xl text-navy-950">
                    {formatCurrency(course.priceMonthlyCents, course.priceCurrency ?? "USD")}
                    <span className="text-sm text-ink-500 font-body"> / month</span>
                  </p>
                  <p className="text-xs text-ink-500 mt-1 mb-6">Billed monthly, cancel anytime.</p>

                  {course.enrollmentOpen ? (
                    <CheckoutButton
                      courseId={course.id}
                      currency={(course.priceCurrency as Currency | null) ?? "USD"}
                      label="Enroll Now"
                      loginCallbackUrl={`/courses/${course.slug}/enroll`}
                    />
                  ) : (
                    <p className="rounded-md bg-cream-100 px-4 py-3 text-sm text-ink-500 text-center">
                      Enrollment is currently closed for this course. Check back soon.
                    </p>
                  )}
                </>
              ) : (
                <>
                  <p className="text-sm text-ink-500 mb-4">
                    This course is included in our subscription plans rather than sold individually.
                  </p>
                  <Link
                    href="/pricing"
                    className="inline-flex w-full items-center justify-center rounded-sm bg-navy-950 px-6 py-2.5 text-sm font-medium text-cream-50 hover:bg-navy-800 transition-colors"
                  >
                    View Plans
                  </Link>
                </>
              )}

              <Link
                href="/free-trial"
                className="block text-center text-xs text-ink-500 hover:text-gold-700 mt-4 hover:underline"
              >
                Not sure yet? Book a free trial class
              </Link>
            </div>
          </div>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }} />
    </div>
  );
}
