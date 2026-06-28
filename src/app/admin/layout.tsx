import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { PortalSidebar, PortalMobileNav } from "@/components/portal/shared/portal-sidebar";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const ADMIN_NAV = [
  { label: "Dashboard", href: "/admin", iconName: "LayoutDashboard" },
  { label: "Students", href: "/admin/students", iconName: "Users" },
  { label: "Teachers", href: "/admin/teachers", iconName: "GraduationCap" },
  { label: "Courses", href: "/admin/courses", iconName: "BookOpen" },
  { label: "Payments", href: "/admin/payments", iconName: "CreditCard" },
  { label: "Attendance", href: "/admin/attendance", iconName: "CalendarCheck" },
  { label: "Testimonials", href: "/admin/testimonials", iconName: "MessageSquareQuote" },
  { label: "Blog", href: "/admin/blog", iconName: "Newspaper" },
  { label: "Announcements", href: "/admin/announcements", iconName: "Megaphone" },
  { label: "Analytics", href: "/admin/analytics", iconName: "BarChart3" },
] as const;

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login?callbackUrl=/admin");
  }

  return (
    <div className="flex bg-cream-100 min-h-[calc(100vh-5rem)]">
      <PortalSidebar navItems={ADMIN_NAV} portalLabel="Admin Portal" />
      <div className="flex-1 flex flex-col">
        <PortalMobileNav navItems={ADMIN_NAV} />
        <main className="flex-1 p-5 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
