import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";

import { auth } from "@/lib/auth";
import { getStudentByUserId, getStudentEnrollments } from "@/lib/data/student";
import { PortalSectionHeader } from "@/components/portal/shared/section-header";
import { PortalEmptyState } from "@/components/portal/shared/empty-state";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata = { title: "My Courses" };

const STATUS_VARIANT: Record<string, "success" | "warning" | "outline" | "default"> = {
  ACTIVE: "success",
  PAUSED: "warning",
  COMPLETED: "outline",
  CANCELLED: "default",
};

export default async function StudentCoursesPage() {
  const session = await auth();
  const student = await getStudentByUserId(session!.user.id);
  const enrollments = student ? await getStudentEnrollments(student.id) : [];

  return (
    <div>
      <PortalSectionHeader title="My Courses" description="All courses you're currently enrolled in." />

      {enrollments.length === 0 ? (
        <PortalEmptyState
          icon={BookOpen}
          title="No enrollments yet"
          description="Once you're enrolled in a course, it will appear here with lessons, modules, and your progress."
          action={
            <Button asChild size="sm" variant="gold">
              <Link href="/free-trial">Book Free Trial</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid sm:grid-cols-2 gap-5">
          {enrollments.map((enrollment) => (
            <Link
              key={enrollment.id}
              href={`/student/courses/${enrollment.course.slug}`}
              className="group flex flex-col rounded-lg border border-ink-300/15 bg-white p-6 hover:border-gold-500/40 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <Badge variant={STATUS_VARIANT[enrollment.status]}>{enrollment.status}</Badge>
                <ArrowRight className="h-4 w-4 text-gold-600 group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="font-display text-lg text-navy-950 mb-1.5">{enrollment.course.title}</h3>
              <p className="text-xs text-ink-500 mb-4">
                Taught by {enrollment.course.teacher?.user.name ?? "TBA"}
              </p>
              <div className="mt-auto">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-ink-500">Progress</span>
                  <span className="text-xs font-medium text-navy-950">{enrollment.progress}%</span>
                </div>
                <Progress value={enrollment.progress} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
