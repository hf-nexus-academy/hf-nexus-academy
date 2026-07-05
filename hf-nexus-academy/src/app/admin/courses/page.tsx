import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";

import { getAllCourses, getAllTeachersForSelect } from "@/lib/data/admin";
import { PortalSectionHeader } from "@/components/portal/shared/section-header";
import { PortalEmptyState } from "@/components/portal/shared/empty-state";
import { CreateCourseDialog } from "@/components/portal/admin/create-course-dialog";
import { Badge } from "@/components/ui/badge";
import { COURSE_CATEGORY_LABELS } from "@/lib/constants";

export const metadata = { title: "Manage Courses" };

export default async function AdminCoursesPage() {
  const [courses, teachers] = await Promise.all([getAllCourses(), getAllTeachersForSelect()]);

  return (
    <div>
      <PortalSectionHeader
        title="Manage Courses"
        description={`${courses.length} course${courses.length === 1 ? "" : "s"} on the platform.`}
        action={<CreateCourseDialog teachers={teachers.map((t) => ({ id: t.id, name: t.user.name }))} />}
      />

      {courses.length === 0 ? (
        <PortalEmptyState
          icon={BookOpen}
          title="No courses created yet"
          description="Use the Add Course button to create your first course."
        />
      ) : (
        <div className="rounded-lg border border-ink-300/15 bg-white divide-y divide-ink-300/10">
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/admin/courses/${course.id}`}
              className="flex items-center justify-between gap-4 p-5 hover:bg-cream-50 transition-colors"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-navy-950 truncate">{course.title}</p>
                <p className="text-xs text-ink-500 truncate">
                  {COURSE_CATEGORY_LABELS[course.category]} ·{" "}
                  {course.teacher ? course.teacher.user.name : "Unassigned"}
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-3 shrink-0">
                <Badge variant="outline">{course.enrollments.length} students</Badge>
                <Badge variant={course.isPublished ? "success" : "outline"}>
                  {course.isPublished ? "Published" : "Hidden"}
                </Badge>
              </div>
              <ArrowRight className="h-4 w-4 text-gold-600 shrink-0" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
