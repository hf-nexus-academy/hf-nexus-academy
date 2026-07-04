import { CalendarCheck } from "lucide-react";

import { auth } from "@/lib/auth";
import { getTeacherByUserId, getTeacherCourses, getTeacherEnrolledStudentsForCourse } from "@/lib/data/teacher";
import { PortalSectionHeader } from "@/components/portal/shared/section-header";
import { PortalEmptyState } from "@/components/portal/shared/empty-state";
import { MarkAttendanceDialog } from "@/components/portal/teacher/mark-attendance-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";

export const metadata = { title: "Attendance" };

export default async function TeacherAttendancePage() {
  const session = await auth();
  const teacher = await getTeacherByUserId(session!.user.id);
  const courses = teacher ? await getTeacherCourses(teacher.id) : [];

  const coursesWithStudents = await Promise.all(
    courses.map(async (course) => ({
      course,
      students: await getTeacherEnrolledStudentsForCourse(course.id),
    }))
  );

  const hasAnyStudents = coursesWithStudents.some((c) => c.students.length > 0);

  return (
    <div>
      <PortalSectionHeader title="Attendance" description="Mark attendance for your enrolled students, by course." />

      {!hasAnyStudents ? (
        <PortalEmptyState
          icon={CalendarCheck}
          title="No enrolled students yet"
          description="Once students are enrolled in your courses, you'll be able to mark their attendance here."
        />
      ) : (
        <div className="flex flex-col gap-6">
          {coursesWithStudents
            .filter((c) => c.students.length > 0)
            .map(({ course, students }) => (
              <div key={course.id} className="rounded-lg border border-ink-300/15 bg-white overflow-hidden">
                <div className="px-6 py-4 bg-cream-100 border-b border-ink-300/10">
                  <h3 className="font-display text-base text-navy-950">{course.title}</h3>
                </div>
                <div className="flex flex-col divide-y divide-ink-300/10">
                  {students.map((enrollment) => (
                    <div key={enrollment.id} className="flex items-center justify-between gap-4 px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="text-xs">
                            {getInitials(enrollment.student.user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <p className="text-sm font-medium text-navy-950">{enrollment.student.user.name}</p>
                      </div>
                      <MarkAttendanceDialog
                        studentId={enrollment.studentId}
                        courseId={course.id}
                        courseTitle={course.title}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
