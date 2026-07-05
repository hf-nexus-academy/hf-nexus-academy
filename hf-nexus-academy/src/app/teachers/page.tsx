import type { Metadata } from "next";
import { TeacherCard } from "@/components/shared/teacher-card";
import { TEACHERS } from "@/lib/teachers-data";

export const metadata: Metadata = {
  title: "Our Teachers",
  description:
    "Meet the qualified scholars teaching at HF Nexus Academy: Mufti Muhammad Faizan, Mufti Ahsan Ilyas, and Mufti Faizan Tahir.",
  alternates: { canonical: "/teachers" },
};

export default function TeachersPage() {
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
        <div className="container grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TEACHERS.map((teacher) => (
            <TeacherCard key={teacher.slug} teacher={teacher} />
          ))}
        </div>
      </section>
    </div>
  );
}
