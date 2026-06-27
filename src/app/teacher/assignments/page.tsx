import Link from "next/link";
import { ClipboardList, ArrowRight } from "lucide-react";

import { auth } from "@/lib/auth";
import { getTeacherByUserId, getTeacherAssignments, getTeacherLessons } from "@/lib/data/teacher";
import { PortalSectionHeader } from "@/components/portal/shared/section-header";
import { PortalEmptyState } from "@/components/portal/shared/empty-state";
import { CreateAssignmentDialog } from "@/components/portal/teacher/create-assignment-dialog";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Manage Assignments" };

export default async function TeacherAssignmentsPage() {
  const session = await auth();
  const teacher = await getTeacherByUserId(session!.user.id);
  const [assignments, lessons] = teacher
    ? await Promise.all([getTeacherAssignments(teacher.id), getTeacherLessons(teacher.id)])
    : [[], []];

  return (
    <div>
      <PortalSectionHeader
        title="Manage Assignments"
        description="Create assignments and track student submissions."
        action={
          <CreateAssignmentDialog
            lessons={lessons.map((l) => ({ id: l.id, title: l.title, courseTitle: l.course.title }))}
          />
        }
      />

      {assignments.length === 0 ? (
        <PortalEmptyState
          icon={ClipboardList}
          title="No assignments created yet"
          description="Use the Create Assignment button to assign your first piece of coursework."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {assignments.map((assignment) => {
            const pendingCount = assignment.submissions.filter((s) => s.status === "SUBMITTED").length;
            const gradedCount = assignment.submissions.filter((s) => s.status === "GRADED").length;

            return (
              <Link
                key={assignment.id}
                href={`/teacher/assignments/${assignment.id}`}
                className="group flex items-center justify-between gap-4 rounded-lg border border-ink-300/15 bg-white p-5 hover:border-gold-500/40 hover:shadow-sm transition-all"
              >
                <div>
                  <p className="text-sm font-medium text-navy-950">{assignment.title}</p>
                  <p className="text-xs text-ink-500 mt-0.5">
                    {assignment.lesson?.course.title ?? "General"}
                    {assignment.dueAt && ` · Due ${formatDate(assignment.dueAt)}`}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {pendingCount > 0 && <Badge variant="warning">{pendingCount} to grade</Badge>}
                  {gradedCount > 0 && <Badge variant="success">{gradedCount} graded</Badge>}
                  <ArrowRight className="h-4 w-4 text-gold-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
