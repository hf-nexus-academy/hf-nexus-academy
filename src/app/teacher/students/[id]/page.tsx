import { notFound } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PortalSectionHeader } from "@/components/portal/shared/section-header";
import { GradeSubmissionDialog } from "@/components/portal/teacher/grade-submission-dialog";
import { MarkAttendanceDialog } from "@/components/portal/teacher/mark-attendance-dialog";

import { auth } from "@/lib/auth";
import { getTeacherByUserId, getTeacherStudentDetail } from "@/lib/data/teacher";
import { getInitials, formatDate } from "@/lib/utils";

export async function generateMetadata() {
  return { title: "Student Detail" };
}

const STATUS_VARIANT: Record<string, "success" | "warning" | "destructive" | "outline"> = {
  PRESENT: "success",
  LATE: "warning",
  ABSENT: "destructive",
  EXCUSED: "outline",
};

export default async function TeacherStudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  const teacher = await getTeacherByUserId(session!.user.id);
  if (!teacher) notFound();

  const detail = await getTeacherStudentDetail(teacher.id, id);
  if (!detail || !detail.student) notFound();

  const { student, enrollments, submissions, attendance } = detail;

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Avatar className="h-14 w-14">
          <AvatarFallback className="text-base">{getInitials(student.user.name)}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="font-display text-2xl text-navy-950">{student.user.name}</h1>
          <p className="text-sm text-ink-500">{student.user.email}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-lg border border-ink-300/15 bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-base text-navy-950">Enrolled Courses</h2>
          </div>
          <div className="flex flex-col gap-3">
            {enrollments.map((enrollment) => (
              <div key={enrollment.id} className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-navy-950">{enrollment.course.title}</p>
                  <p className="text-xs text-ink-500">{enrollment.progress}% complete</p>
                </div>
                <MarkAttendanceDialog
                  studentId={student.id}
                  courseId={enrollment.courseId}
                  courseTitle={enrollment.course.title}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-ink-300/15 bg-white p-6">
          <h2 className="font-display text-base text-navy-950 mb-4">Recent Attendance</h2>
          {attendance.length === 0 ? (
            <p className="text-sm text-ink-500">No attendance recorded yet.</p>
          ) : (
            <div className="flex flex-col divide-y divide-ink-300/10">
              {attendance.map((a) => (
                <div key={a.id} className="flex items-center justify-between py-2.5">
                  <span className="text-sm text-ink-700">{formatDate(a.date)}</span>
                  <Badge variant={STATUS_VARIANT[a.status]}>{a.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6">
        <PortalSectionHeader title="Submissions" />
        {submissions.length === 0 ? (
          <p className="text-sm text-ink-500">No submissions from this student yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {submissions.map((sub) => (
              <div
                key={sub.id}
                className="flex items-center justify-between gap-4 rounded-lg border border-ink-300/15 bg-white p-5"
              >
                <div>
                  <p className="text-sm font-medium text-navy-950">{sub.assignment.title}</p>
                  <p className="text-xs text-ink-500 mt-0.5">
                    Submitted {formatDate(sub.submittedAt)}
                    {sub.score !== null && ` · Score: ${sub.score}/${sub.assignment.maxScore}`}
                  </p>
                </div>
                <GradeSubmissionDialog
                  submissionId={sub.id}
                  studentName={student.user.name}
                  maxScore={sub.assignment.maxScore}
                  existingScore={sub.score}
                  existingFeedback={sub.feedback}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
