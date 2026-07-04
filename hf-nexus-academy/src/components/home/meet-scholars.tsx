import Link from "next/link";
import { TeacherCard, type TeacherCardData } from "@/components/shared/teacher-card";
import { getPublishedTeachers } from "@/lib/data/public";

export async function MeetScholars() {
  const dbTeachers = await getPublishedTeachers();
  const teachers: TeacherCardData[] = dbTeachers.slice(0, 3).map((t) => ({
    slug: t.slug,
    name: t.user.name,
    title: t.title,
    bio: t.bio,
    specializations: t.specializations,
    experienceYears: t.experienceYears,
    photoUrl: t.photoUrl,
  }));

  if (teachers.length === 0) return null;

  return (
    <section className="bg-cream-100 py-20 lg:py-28">
      <div className="container">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-14">
          <div className="max-w-xl">
            <span className="text-xs uppercase tracking-[0.2em] text-gold-600 font-medium">
              Meet the Scholars
            </span>
            <h2 className="font-display text-3xl lg:text-4xl text-navy-950 mt-3 text-balance">
              Learn directly from qualified, experienced teachers
            </h2>
          </div>
          <Link href="/teachers" className="text-sm font-medium text-gold-700 hover:underline shrink-0">
            View all teachers →
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {teachers.map((teacher) => (
            <TeacherCard key={teacher.slug} teacher={teacher} />
          ))}
        </div>
      </div>
    </section>
  );
}
