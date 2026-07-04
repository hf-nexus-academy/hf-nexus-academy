import type { Metadata } from "next";
import { TeacherCard, type TeacherCardData } from "@/components/shared/teacher-card";
import { getPublishedTeachers } from "@/lib/data/public";

export const metadata: Metadata = {
  title: "Our Teachers",
  description:
    "Meet the qualified scholars teaching at HF Nexus Academy, trained in classical Islamic curricula and bringing years of direct teaching experience.",
  alternates: { canonical: "/teachers" },
};

export const revalidate = 60;

export default async function TeachersPage() {
  const dbTeachers = await getPublishedTeachers();
  const teachers: TeacherCardData[] = dbTeachers.map((t) => ({
    slug: t.slug,
    name: t.user.name,
    title: t.title,
    bio: t.bio,
    specializations: t.specializations,
    experienceYears: t.experienceYears,
    photoUrl: t.photoUrl,
  }));

  return (
    <div>
      <section className="bg-navy-950 py-20 lg:py-24">
        <div className="container max-w-3xl text-center">
          <span className="text-xs uppercase tracking-[0.2em] text-gold-500 font-medium">
            Our Scholars
          </span>
          <h1 className="font-display text-4xl lg:text-5xl text-cream-50 mt-4 text-balance">
            Learn from qualified, experienced teachers
          </h1>
          <p className="mt-6 text-cream-50/70 leading-relaxed">
            Every HF Nexus Academy teacher is trained in classical Islamic curricula
            and brings years of direct teaching experience to every live class.
          </p>
        </div>
      </section>

      <section className="bg-cream-50 py-16 lg:py-20">
        <div className="container">
          {teachers.length === 0 ? (
            <p className="text-center text-ink-500 py-10">
              No teacher profiles are currently published. Check back soon.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {teachers.map((teacher) => (
                <TeacherCard key={teacher.slug} teacher={teacher} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
