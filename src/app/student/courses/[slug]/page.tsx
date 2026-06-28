import { notFound } from "next/navigation";
import { PlayCircle, FileDown, Lock } from "lucide-react";

import { auth } from "@/lib/auth";
import { getStudentByUserId, getEnrollmentByCourseSlug } from "@/lib/data/student";
import { PortalSectionHeader } from "@/components/portal/shared/section-header";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return { title: slug.replace(/-/g, " ") };
}

export default async function StudentCourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = await auth();
  const student = await getStudentByUserId(session!.user.id);
  if (!student) notFound();

  const enrollment = await getEnrollmentByCourseSlug(student.id, slug);
  if (!enrollment) notFound();

  const { course } = enrollment;

  // Lessons grouped: those within modules, plus any standalone lessons
  const moduleLessonIds = new Set(course.modules.flatMap((m) => m.lessons.map((l) => l.id)));
  const standaloneLessons = course.lessons.filter((l) => !moduleLessonIds.has(l.id));

  return (
    <div>
      <PortalSectionHeader
        title={course.title}
        description={`Taught by ${course.teacher?.user.name ?? "TBA"}`}
      />

      <div className="rounded-lg border border-ink-300/15 bg-white p-6 mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-navy-950">Course Progress</span>
          <span className="text-sm text-ink-500">{enrollment.progress}%</span>
        </div>
        <Progress value={enrollment.progress} />
      </div>

      <div className="flex flex-col gap-6">
        {course.modules.map((module) => (
          <div key={module.id} className="rounded-lg border border-ink-300/15 bg-white overflow-hidden">
            <div className="px-6 py-4 bg-cream-100 border-b border-ink-300/10">
              <h3 className="font-display text-base text-navy-950">{module.title}</h3>
            </div>
            <div className="flex flex-col divide-y divide-ink-300/10">
              {module.lessons.map((lesson) => (
                <LessonRow key={lesson.id} lesson={lesson} />
              ))}
              {module.lessons.length === 0 && (
                <p className="px-6 py-4 text-sm text-ink-300">No lessons added to this module yet.</p>
              )}
            </div>
          </div>
        ))}

        {standaloneLessons.length > 0 && (
          <div className="rounded-lg border border-ink-300/15 bg-white overflow-hidden">
            <div className="px-6 py-4 bg-cream-100 border-b border-ink-300/10">
              <h3 className="font-display text-base text-navy-950">Lessons</h3>
            </div>
            <div className="flex flex-col divide-y divide-ink-300/10">
              {standaloneLessons.map((lesson) => (
                <LessonRow key={lesson.id} lesson={lesson} />
              ))}
            </div>
          </div>
        )}

        {course.modules.length === 0 && standaloneLessons.length === 0 && (
          <div className="rounded-lg border border-dashed border-ink-300/25 bg-white py-14 text-center">
            <p className="text-sm text-ink-500">
              No lessons have been published for this course yet. Check back soon.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function LessonRow({
  lesson,
}: {
  lesson: {
    id: string;
    title: string;
    durationMins: number | null;
    isPublished: boolean;
    videoUrl: string | null;
    resourceUrl: string | null;
  };
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-6 py-4">
      <div className="flex items-center gap-3 min-w-0">
        {lesson.isPublished ? (
          <PlayCircle className="h-5 w-5 text-gold-600 shrink-0" />
        ) : (
          <Lock className="h-5 w-5 text-ink-300 shrink-0" />
        )}
        <div className="min-w-0">
          <p className="text-sm font-medium text-navy-950 truncate">{lesson.title}</p>
          {lesson.durationMins && <p className="text-xs text-ink-500">{lesson.durationMins} min</p>}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {!lesson.isPublished && <Badge variant="outline">Coming Soon</Badge>}
        {lesson.resourceUrl && lesson.isPublished && (
          <a href={lesson.resourceUrl} className="text-ink-500 hover:text-gold-600" aria-label="Download resource">
            <FileDown className="h-4 w-4" />
          </a>
        )}
      </div>
    </div>
  );
}
