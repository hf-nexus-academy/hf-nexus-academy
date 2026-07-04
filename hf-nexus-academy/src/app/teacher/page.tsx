import Link from "next/link";
import { Users, BookOpen, ClipboardCheck, FileCheck } from "lucide-react";

import { auth } from "@/lib/auth";
import { getTeacherByUserId, getTeacherDashboardData } from "@/lib/data/teacher";
import { StatCard } from "@/components/portal/shared/stat-card";
import { PortalSectionHeader } from "@/components/portal/shared/section-header";
import { PortalEmptyState } from "@/components/portal/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Teacher Dashboard" };

export default async function TeacherDashboardPage() {
  const session = await auth();
  const teacher = await getTeacherByUserId(session!.user.id);

  if (!teacher) {
    return (
      <PortalEmptyState
        icon={Users}
        title="No teacher profile linked to this account"
        description={
          session?.user.role === "ADMIN"
            ? "You're viewing this as an admin. Teacher-specific data requires a linked Teacher profile."
            : "There was an issue loading your teacher profile. Please contact support."
        }
      />
    );
  }

  const { courses, recentSubmissions, totalStudents, pendingGrading } = await getTeacherDashboardData(
    teacher.id
  );

  const totalEnrollments = courses.reduce((sum, c) => sum + c.enrollments.length, 0);

  return (
    <div>
      <PortalSectionHeader
        title={`Welcome back, ${teacher.user.name.split(" ")[0]}`}
        description="Here's an overview of your classes and students."
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard label="My Courses" value={courses.length} icon={BookOpen} />
        <StatCard label="Active Students" value={totalStudents} icon={Users} accent="navy" />
        <StatCard label="Total Enrollments" value={totalEnrollments} icon={ClipboardCheck} />
        <StatCard label="Pending Grading" value={pendingGrading} icon={FileCheck} accent="navy" />
      </div>

      <div className="grid lg:grid-cols-[1.3fr_1fr] gap-6">
        <div className="rounded-lg border border-ink-300/15 bg-white p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-lg text-navy-950">My Courses</h2>
            <Link href="/teacher/lessons" className="text-sm text-gold-700 hover:underline">
              Manage Lessons
            </Link>
          </div>

          {courses.length === 0 ? (
            <PortalEmptyState
              icon={BookOpen}
              title="No courses assigned yet"
              description="Courses you're assigned to teach will appear here."
            />
          ) : (
            <div className="flex flex-col divide-y divide-ink-300/10">
              {courses.map((course) => (
                <div key={course.id} className="flex items-center justify-between py-3.5">
                  <div>
                    <p className="text-sm font-medium text-navy-950">{course.title}</p>
                    <p className="text-xs text-ink-500 mt-0.5">{course.category.replace(/_/g, " ")}</p>
                  </div>
                  <Badge variant="outline">{course.enrollments.length} students</Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-lg border border-ink-300/15 bg-white p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-lg text-navy-950">Recent Submissions</h2>
            <Link href="/teacher/assignments" className="text-sm text-gold-700 hover:underline">
              View all
            </Link>
          </div>

          {recentSubmissions.length === 0 ? (
            <PortalEmptyState
              icon={FileCheck}
              title="No submissions yet"
              description="Student assignment submissions will appear here for grading."
            />
          ) : (
            <div className="flex flex-col gap-3">
              {recentSubmissions.map((sub) => (
                <div key={sub.id} className="flex items-start justify-between gap-3 text-sm">
                  <div>
                    <p className="font-medium text-navy-950">{sub.student.user.name}</p>
                    <p className="text-xs text-ink-500">{sub.assignment.title}</p>
                  </div>
                  <span className="text-xs text-ink-300 shrink-0">{formatDate(sub.submittedAt)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
