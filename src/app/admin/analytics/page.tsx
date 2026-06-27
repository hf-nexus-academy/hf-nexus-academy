import { Users, GraduationCap, BookOpen, DollarSign, TrendingUp, Inbox } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { getAdminAnalytics } from "@/lib/data/admin";
import { StatCard } from "@/components/portal/shared/stat-card";
import { PortalSectionHeader } from "@/components/portal/shared/section-header";
import { EnrollmentsByCourseChart } from "@/components/portal/admin/analytics-chart";
import { formatCurrency } from "@/lib/utils";

export const metadata = { title: "Analytics" };

async function getEnrollmentChartData() {
  const courses = await prisma.course.findMany({
    include: { _count: { select: { enrollments: true } } },
    orderBy: { title: "asc" },
  });

  return courses
    .filter((c) => c._count.enrollments > 0)
    .map((c) => ({ name: c.title, enrollments: c._count.enrollments }))
    .sort((a, b) => b.enrollments - a.enrollments)
    .slice(0, 10);
}

export default async function AdminAnalyticsPage() {
  const [analytics, chartData] = await Promise.all([getAdminAnalytics(), getEnrollmentChartData()]);

  return (
    <div>
      <PortalSectionHeader title="Analytics" description="Platform performance at a glance." />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        <StatCard label="Total Students" value={analytics.totalStudents} icon={Users} />
        <StatCard label="Total Teachers" value={analytics.totalTeachers} icon={GraduationCap} accent="navy" />
        <StatCard label="Total Courses" value={analytics.totalCourses} icon={BookOpen} />
        <StatCard label="Active Enrollments" value={analytics.activeEnrollments} icon={TrendingUp} accent="navy" />
        <StatCard label="Total Revenue" value={formatCurrency(analytics.totalRevenueCents)} icon={DollarSign} />
        <StatCard label="New Leads (This Month)" value={analytics.newLeadsThisMonth} icon={Inbox} accent="navy" />
      </div>

      <div className="rounded-lg border border-ink-300/15 bg-white p-6">
        <h2 className="font-display text-lg text-navy-950 mb-1">Top Courses by Enrollment</h2>
        <p className="text-sm text-ink-500 mb-6">Most popular courses across the platform.</p>
        {chartData.length === 0 ? (
          <p className="text-sm text-ink-500 py-10 text-center">
            No enrollment data yet. This chart will populate as students enroll in courses.
          </p>
        ) : (
          <EnrollmentsByCourseChart data={chartData} />
        )}
      </div>
    </div>
  );
}
