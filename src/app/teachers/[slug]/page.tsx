import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { GraduationCap, ArrowRight } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TEACHERS } from "@/lib/teachers-data";
import { getInitials } from "@/lib/utils";

export function generateStaticParams() {
  return TEACHERS.map((t) => ({ slug: t.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const teacher = TEACHERS.find((t) => t.slug === params.slug);
  if (!teacher) return {};
  return {
    title: teacher.name,
    description: teacher.bio,
    alternates: { canonical: `/teachers/${teacher.slug}` },
  };
}

export default function TeacherDetailPage({ params }: { params: { slug: string } }) {
  const teacher = TEACHERS.find((t) => t.slug === params.slug);
  if (!teacher) notFound();

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: teacher.name,
    jobTitle: "Islamic Studies Teacher",
    description: teacher.bio,
    worksFor: {
      "@type": "EducationalOrganization",
      name: "HF Nexus Academy",
    },
  };

  return (
    <div>
      <section className="bg-navy-950 py-16 lg:py-20">
        <div className="container flex flex-col sm:flex-row items-center sm:items-start gap-8">
          <Avatar className="h-28 w-28 border-4 border-gold-500/30">
            {teacher.photoUrl && <AvatarImage src={teacher.photoUrl} alt={teacher.name} />}
            <AvatarFallback className="text-3xl">{getInitials(teacher.name)}</AvatarFallback>
          </Avatar>
          <div className="text-center sm:text-left">
            <h1 className="font-display text-3xl lg:text-4xl text-cream-50">{teacher.name}</h1>
            {teacher.experienceYears && (
              <p className="flex items-center justify-center sm:justify-start gap-1.5 text-sm text-cream-50/60 mt-2">
                <GraduationCap className="h-4 w-4 text-gold-500" />
                {teacher.experienceYears}+ years teaching experience
              </p>
            )}
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-4">
              {teacher.specializations.map((spec) => (
                <Badge key={spec} variant="gold">
                  {spec}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-cream-50 py-16 lg:py-20">
        <div className="container max-w-3xl">
          <h2 className="font-display text-2xl text-navy-950 mb-4">Biography</h2>
          <p className="text-ink-500 leading-relaxed">{teacher.longBio}</p>
        </div>
      </section>

      <section className="bg-cream-100 py-16 lg:py-20">
        <div className="container max-w-3xl">
          <h2 className="font-display text-2xl text-navy-950 mb-6">Courses Taught</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {teacher.coursesTaught.map((course) => (
              <Link
                key={course.slug}
                href={`/courses/${course.category}`}
                className="rounded-md border border-ink-300/15 bg-white px-5 py-4 text-sm font-medium text-navy-950 hover:border-gold-500/40 hover:shadow-sm transition-all"
              >
                {course.title}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy-950 py-16">
        <div className="container text-center">
          <h2 className="font-display text-2xl lg:text-3xl text-cream-50 mb-6">
            Book a free trial class with {teacher.name}
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
    </div>
  );
}
