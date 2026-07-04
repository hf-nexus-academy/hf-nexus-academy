import { notFound } from "next/navigation";
import { ClipboardList } from "lucide-react";

import { auth } from "@/lib/auth";
import { getTeacherByUserId, getAssignmentWithSubmissions } from "@/lib/data/teacher";
import { PortalSectionHeader } from "@/components/portal/shared/section-header";
import { PortalEmptyState } from "@/components/portal/shared/empty-state";
import { GradeSubmissionDialog } from "@/components/portal/teacher/grade-submission-dialog";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export async function generateMetadata() {
  return { title: "Assignment Submissions" };
}

const STATUS_VARIANT: Record<string, "success" | "warning" | "destructive" | "outline"> = {
  SUBMITTED: "outline",
  GRADED: "success",
  LATE: "warning",
  MISSING: "destructive",
  ASSIGNED: "outline",
};

export default async function TeacherAssignmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  const teacher = await getTeacherByUserId(session!.user.id);
  if (!teacher) notFound();

  const assignment = await getAssignmentWithSubmissions(teacher.id, id);
  if (!assignment) notFound();

  return (
    <div>
      <PortalSectionHeader
        title={assignment.title}
        description={`${assignment.lesson?.course.title ?? "General"} · Max score: ${assignment.maxScore}`}
      />

      <div className="rounded-lg border border-ink-300/15 bg-white p-6 mb-8">
        <h3 className="font-display text-sm text-navy-950 mb-2">Instructions</h3>
        <p className="text-sm text-ink-500 leading-relaxed whitespace-pre-wrap">{assignment.instructions}</p>
      </div>

      <h2 className="font-display text-lg text-navy-950 mb-4">Submissions ({assignment.submissions.length})</h2>

      {assignment.submissions.length === 0 ? (
        <PortalEmptyState
          icon={ClipboardList}
          title="No submissions yet"
          description="Student submissions for this assignment will appear here."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {assignment.submissions.map((sub) => (
            <div key={sub.id} className="rounded-lg border border-ink-300/15 bg-white p-5">
              <div className="flex items-center justify-between gap-4 mb-3">
                <div>
                  <p className="text-sm font-medium text-navy-950">{sub.student.user.name}</p>
                  <p className="text-xs text-ink-500 mt-0.5">Submitted {formatDate(sub.submittedAt)}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant={STATUS_VARIANT[sub.status]}>{sub.status}</Badge>
                  <GradeSubmissionDialog
                    submissionId={sub.id}
                    studentName={sub.student.user.name}
                    maxScore={assignment.maxScore}
                    existingScore={sub.score}
                    existingFeedback={sub.feedback}
                  />
                </div>
              </div>
              {sub.content && (
                <p className="text-sm text-ink-700 bg-cream-50 rounded-md p-3.5 whitespace-pre-wrap">
                  {sub.content}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
