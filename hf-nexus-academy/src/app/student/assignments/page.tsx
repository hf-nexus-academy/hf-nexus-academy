import { ClipboardList } from "lucide-react";

import { auth } from "@/lib/auth";
import { getStudentByUserId, getStudentAssignments } from "@/lib/data/student";
import { PortalSectionHeader } from "@/components/portal/shared/section-header";
import { PortalEmptyState } from "@/components/portal/shared/empty-state";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { SubmitAssignmentDialog } from "@/components/portal/student/submit-assignment-dialog";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Assignments" };

const STATUS_VARIANT: Record<string, "success" | "warning" | "outline" | "destructive"> = {
  SUBMITTED: "outline",
  GRADED: "success",
  LATE: "warning",
  MISSING: "destructive",
  ASSIGNED: "outline",
};

export default async function StudentAssignmentsPage() {
  const session = await auth();
  const student = await getStudentByUserId(session!.user.id);
  const { submissions, pending } = student
    ? await getStudentAssignments(student.id)
    : { submissions: [], pending: [] };

  return (
    <div>
      <PortalSectionHeader title="Assignments" description="Track and submit your coursework." />

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">Pending ({pending.length})</TabsTrigger>
          <TabsTrigger value="submitted">Submitted ({submissions.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          {pending.length === 0 ? (
            <PortalEmptyState
              icon={ClipboardList}
              title="No pending assignments"
              description="You're all caught up. New assignments will appear here when assigned by your teacher."
            />
          ) : (
            <div className="flex flex-col gap-3">
              {pending.map((assignment) => (
                <div
                  key={assignment.id}
                  className="flex items-center justify-between gap-4 rounded-lg border border-ink-300/15 bg-white p-5"
                >
                  <div>
                    <p className="font-medium text-navy-950 text-sm">{assignment.title}</p>
                    <p className="text-xs text-ink-500 mt-1">{assignment.lesson?.course.title ?? "General"}</p>
                    {assignment.dueAt && (
                      <p className="text-xs text-ink-300 mt-1">Due {formatDate(assignment.dueAt)}</p>
                    )}
                  </div>
                  <SubmitAssignmentDialog assignmentId={assignment.id} assignmentTitle={assignment.title} />
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="submitted">
          {submissions.length === 0 ? (
            <PortalEmptyState
              icon={ClipboardList}
              title="No submissions yet"
              description="Submitted assignments will appear here, along with grades and feedback once reviewed."
            />
          ) : (
            <div className="flex flex-col gap-3">
              {submissions.map((submission) => (
                <div key={submission.id} className="rounded-lg border border-ink-300/15 bg-white p-5">
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <p className="font-medium text-navy-950 text-sm">{submission.assignment.title}</p>
                    <Badge variant={STATUS_VARIANT[submission.status]}>{submission.status}</Badge>
                  </div>
                  <p className="text-xs text-ink-500 mb-2">
                    {submission.assignment.lesson?.course.title ?? "General"} · Submitted{" "}
                    {formatDate(submission.submittedAt)}
                  </p>
                  {submission.score !== null && (
                    <p className="text-sm text-navy-950 font-medium">
                      Score: {submission.score} / {submission.assignment.maxScore}
                    </p>
                  )}
                  {submission.feedback && (
                    <p className="text-sm text-ink-500 mt-2 border-t border-ink-300/10 pt-2">
                      <span className="font-medium text-navy-950">Feedback: </span>
                      {submission.feedback}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
