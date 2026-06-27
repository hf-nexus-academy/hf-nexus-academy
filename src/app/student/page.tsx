import Link from "next/link";
import { BookOpen, ClipboardList, Award, Bell, ArrowRight } from "lucide-react";

import { auth } from "@/lib/auth";
import { getStudentByUserId, getStudentDashboardData } from "@/lib/data/student";
import { StatCard } from "@/components/portal/shared/stat-card";
import { PortalSectionHeader } from "@/components/portal/shared/section-header";
import { PortalEmptyState } from "@/components/portal/shared/empty-state";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Student Dashboard" };

export default async function StudentDashboardPage() {
  const session = await auth();
  const student = await getStudentByUserId(session!.user.id);

  if (!student) {
    return (
      <PortalEmptyState
        icon={BookOpen}
        title="Student profile not found"
        description="There was an issue loading your student profile. Please contact support."
      />
    );
  }

  const { enrollments, upcomingAssignments, recentNotifications, certificates } =
    await getStudentDashboardData(student.id);

  const activeEnrollments = enrollments.filter((e) => e.status === "ACTIVE");
  const avgProgress =
    activeEnrollments.length > 0
      ? Math.round(activeEnrollments.reduce((sum, e) => sum + e.progress, 0) / activeEnrollments.length)
      : 0;

  return (
    <div>
      <PortalSectionHeader
        title={`Welcome back, ${student.user.name.split(" ")[0]}`}
        description="Here's an overview of your learning progress."
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard label="Active Courses" value={activeEnrollments.length} icon={BookOpen} />
        <StatCard label="Avg. Progress" value={`${avgProgress}%`} icon={ClipboardList} accent="navy" />
        <StatCard label="Certificates Earned" value={certificates.length} icon={Award} />
        <StatCard label="Pending Assignments" value={upcomingAssignments.length} icon={Bell} accent="navy" />
      </div>

      <div className="grid lg:grid-cols-[1.5fr_1fr] gap-6">
        <div className="flex flex-col gap-6">
          <div className="rounded-lg border border-ink-300/15 bg-white p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-lg text-navy-950">Enrolled Courses</h2>
              <Link href="/student/courses" className="text-sm text-gold-700 hover:underline">
                View all
              </Link>
            </div>

            {activeEnrollments.length === 0 ? (
              <PortalEmptyState
                icon={BookOpen}
                title="No active courses yet"
                description="Book a free trial or contact admissions to get enrolled in your first course."
                action={
                  <Button asChild size="sm" variant="gold">
                    <Link href="/free-trial">Book Free Trial</Link>
                  </Button>
                }
              />
            ) : (
              <div className="flex flex-col gap-5">
                {activeEnrollments.map((enrollment) => (
                  <div key={enrollment.id}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-navy-950 text-sm">{enrollment.course.title}</p>
                      <span className="text-xs text-ink-500">{enrollment.progress}%</span>
                    </div>
                    <Progress value={enrollment.progress} />
                    <p className="text-xs text-ink-300 mt-1.5">
                      Taught by {enrollment.course.teacher?.user.name ?? "TBA"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-lg border border-ink-300/15 bg-white p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-lg text-navy-950">Upcoming Assignments</h2>
              <Link href="/student/assignments" className="text-sm text-gold-700 hover:underline">
                View all
              </Link>
            </div>

            {upcomingAssignments.length === 0 ? (
              <PortalEmptyState
                icon={ClipboardList}
                title="No pending assignments"
                description="You're all caught up. New assignments will appear here when assigned by your teacher."
              />
            ) : (
              <div className="flex flex-col gap-3">
                {upcomingAssignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="flex items-center justify-between gap-3 rounded-md border border-ink-300/10 p-3.5"
                  >
                    <div>
                      <p className="text-sm font-medium text-navy-950">{assignment.title}</p>
                      <p className="text-xs text-ink-500 mt-0.5">
                        {assignment.lesson?.course.title ?? "General"}
                      </p>
                    </div>
                    {assignment.dueAt && (
                      <Badge variant="outline" className="shrink-0">
                        Due {formatDate(assignment.dueAt)}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-ink-300/15 bg-white p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-lg text-navy-950">Notifications</h2>
          </div>

          {recentNotifications.length === 0 ? (
            <PortalEmptyState
              icon={Bell}
              title="No notifications"
              description="Announcements and class reminders will appear here."
            />
          ) : (
            <div className="flex flex-col gap-4">
              {recentNotifications.map((n) => (
                <div key={n.id} className="flex items-start gap-3">
                  <div className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ${n.isRead ? "bg-ink-300/40" : "bg-gold-500"}`} />
                  <div>
                    <p className="text-sm font-medium text-navy-950">{n.title}</p>
                    <p className="text-xs text-ink-500 mt-0.5">{n.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {activeEnrollments.length === 0 && (
        <div className="mt-8 rounded-lg bg-navy-950 p-7 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-cream-50 font-display text-lg">Ready to start learning?</p>
          <Button asChild variant="gold">
            <Link href="/free-trial">
              Book a Free Trial <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
