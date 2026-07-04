import Link from "next/link";
import { Users, GraduationCap, BookOpen, DollarSign, UserPlus, Inbox } from "lucide-react";

import { getAdminAnalytics, getAllContactLeads } from "@/lib/data/admin";
import { StatCard } from "@/components/portal/shared/stat-card";
import { PortalSectionHeader } from "@/components/portal/shared/section-header";
import { PortalEmptyState } from "@/components/portal/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";

export const metadata = { title: "Admin Dashboard" };

export default async function AdminDashboardPage() {
  const analytics = await getAdminAnalytics();
  const leads = await getAllContactLeads();
  const recentLeads = leads.slice(0, 8);

  return (
    <div>
      <PortalSectionHeader title="Admin Dashboard" description="Platform-wide overview." />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard label="Total Students" value={analytics.totalStudents} icon={Users} />
        <StatCard label="Total Teachers" value={analytics.totalTeachers} icon={GraduationCap} accent="navy" />
        <StatCard label="Total Courses" value={analytics.totalCourses} icon={BookOpen} />
        <StatCard
          label="Total Revenue"
          value={formatCurrency(analytics.totalRevenueCents)}
          icon={DollarSign}
          accent="navy"
        />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-10">
        <StatCard label="Active Enrollments" value={analytics.activeEnrollments} icon={UserPlus} />
        <StatCard label="New Leads This Month" value={analytics.newLeadsThisMonth} icon={Inbox} accent="navy" />
      </div>

      <div className="rounded-lg border border-ink-300/15 bg-white p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-lg text-navy-950">Recent Leads</h2>
          <Link href="/admin/students" className="text-sm text-gold-700 hover:underline">
            Manage Students
          </Link>
        </div>

        {recentLeads.length === 0 ? (
          <PortalEmptyState
            icon={Inbox}
            title="No leads yet"
            description="Free trial requests and contact form submissions will appear here."
          />
        ) : (
          <div className="flex flex-col divide-y divide-ink-300/10">
            {recentLeads.map((lead) => (
              <div key={lead.id} className="flex items-center justify-between gap-4 py-3.5">
                <div>
                  <p className="text-sm font-medium text-navy-950">{lead.fullName}</p>
                  <p className="text-xs text-ink-500">
                    {lead.email} · {lead.source === "free_trial" ? "Free Trial" : "Contact Form"}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-ink-300">{formatDate(lead.createdAt)}</span>
                  <Badge variant={lead.status === "NEW" ? "warning" : "outline"}>{lead.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
