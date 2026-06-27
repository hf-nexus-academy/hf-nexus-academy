import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { getAllTeachersForSelect } from "@/lib/data/admin";
import { PortalSectionHeader } from "@/components/portal/shared/section-header";
import { PublishToggle } from "@/components/portal/admin/publish-toggle";
import { Badge } from "@/components/ui/badge";
import { COURSE_CATEGORY_LABELS } from "@/lib/constants";

export async function generateMetadata() {
  return { title: "Course Detail" };
}

async function getCourseDetail(id: string) {
  return prisma.course.findUnique({
    where: { id },
    include: {
      teacher: { include: { user: true } },
      enrollments: { include: { student: { include: { user: true } } } },
      modules: { include: { lessons: true }, orderBy: { order: "asc" } },
      lessons: true,
    },
  });
}

export default async function AdminCourseDetailPage({ params }: { params: { id: string } }) {
  const course = await getCourseDetail(params.id);
  if (!course) notFound();

  await getAllTeachersForSelect();

  return (
    <div>
      <PortalSectionHeader
        title={course.title}
        description={`${COURSE_CATEGORY_LABELS[course.category]} · ${course.level}`}
        action={
          <PublishToggle
            initialPublished={course.isPublished}
            endpoint={`/api/admin/courses/${course.id}`}
            field="isPublished"
            label="Published"
          />
        }
      />

      <div className="rounded-lg border border-ink-300/15 bg-white p-6 mb-6">
        <p className="text-sm text-ink-500 leading-relaxed mb-4">{course.description}</p>
        <p className="text-sm text-navy-950">
          <span className="font-medium">Teacher:</span> {course.teacher?.user.name ?? "Unassigned"}
        </p>
      </div>

      <div className="rounded-lg border border-ink-300/15 bg-white p-6 mb-6">
        <h2 className="font-display text-base text-navy-950 mb-4">
          Enrolled Students ({course.enrollments.length})
        </h2>
        {course.enrollments.length === 0 ? (
          <p className="text-sm text-ink-500">No students enrolled yet.</p>
        ) : (
          <div className="flex flex-col divide-y divide-ink-300/10">
            {course.enrollments.map((e) => (
              <div key={e.id} className="flex items-center justify-between py-2.5">
                <span className="text-sm text-navy-950">{e.student.user.name}</span>
                <Badge variant="outline">{e.progress}%</Badge>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-lg border border-ink-300/15 bg-white p-6">
        <h2 className="font-display text-base text-navy-950 mb-4">
          Lessons ({course.lessons.length} total)
        </h2>
        {course.modules.length === 0 && course.lessons.length === 0 ? (
          <p className="text-sm text-ink-500">No lessons added yet. Teachers can upload lessons from their portal.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {course.lessons.map((lesson) => (
              <div key={lesson.id} className="flex items-center justify-between py-2 border-b border-ink-300/10">
                <span className="text-sm text-navy-950">{lesson.title}</span>
                <Badge variant={lesson.isPublished ? "success" : "outline"}>
                  {lesson.isPublished ? "Published" : "Draft"}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
