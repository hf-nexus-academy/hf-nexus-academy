import Link from "next/link";
import { TeacherCard } from "@/components/shared/teacher-card";
import { TEACHERS } from "@/lib/teachers-data";

export function MeetScholars() {
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
          {TEACHERS.map((teacher) => (
            <TeacherCard key={teacher.slug} teacher={teacher} />
          ))}
        </div>
      </div>
    </section>
  );
}
