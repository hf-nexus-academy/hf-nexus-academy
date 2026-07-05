import { Video } from "lucide-react";

import { auth } from "@/lib/auth";
import { getTeacherByUserId, getTeacherLessons, getTeacherCourses } from "@/lib/data/teacher";
import { PortalSectionHeader } from "@/components/portal/shared/section-header";
import { PortalEmptyState } from "@/components/portal/shared/empty-state";
import { CreateLessonDialog } from "@/components/portal/teacher/create-lesson-dialog";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Manage Lessons" };

export default async function TeacherLessonsPage() {
  const session = await auth();
  const teacher = await getTeacherByUserId(session!.user.id);
  const [lessons, courses] = teacher
    ? await Promise.all([getTeacherLessons(teacher.id), getTeacherCourses(teacher.id)])
    : [[], []];

  return (
    <div>
      <PortalSectionHeader
        title="Manage Lessons"
        description="Upload and organize lessons for your courses."
        action={<CreateLessonDialog courses={courses.map((c) => ({ id: c.id, title: c.title }))} />}
      />

      {lessons.length === 0 ? (
        <PortalEmptyState
          icon={Video}
          title="No lessons uploaded yet"
          description="Use the Upload Lesson button to add your first lesson to a course."
        />
      ) : (
        <div className="rounded-lg border border-ink-300/15 bg-white divide-y divide-ink-300/10">
          {lessons.map((lesson) => (
            <div key={lesson.id} className="flex items-center justify-between gap-4 p-5">
              <div>
                <p className="text-sm font-medium text-navy-950">{lesson.title}</p>
                <p className="text-xs text-ink-500 mt-0.5">
                  {lesson.course.title} {lesson.module && `· ${lesson.module.title}`}
                </p>
              </div>
              <Badge variant={lesson.isPublished ? "success" : "outline"}>
                {lesson.isPublished ? "Published" : "Draft"}
              </Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
