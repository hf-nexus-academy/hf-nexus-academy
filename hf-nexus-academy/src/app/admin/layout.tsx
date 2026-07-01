import type { Metadata } from "next";
import { redirect } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  CreditCard,
  CalendarCheck,
  MessageSquareQuote,
  Newspaper,
  Megaphone,
  BarChart3,
  Tag,
} from "lucide-react";

import { auth } from "@/lib/auth";
import { PortalSidebar, PortalMobileNav, type PortalNavItem } from "@/components/portal/shared/portal-sidebar";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const ADMIN_NAV: PortalNavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Students", href: "/admin/students", icon: Users },
  { label: "Teachers", href: "/admin/teachers", icon: GraduationCap },
  { label: "Courses", href: "/admin/courses", icon: BookOpen },
  { label: "Pricing Plans", href: "/admin/pricing", icon: Tag },
  { label: "Payments", href: "/admin/payments", icon: CreditCard },
  { label: "Attendance", href: "/admin/attendance", icon: CalendarCheck },
  { label: "Testimonials", href: "/admin/testimonials", icon: MessageSquareQuote },
  { label: "Blog", href: "/admin/blog", icon: Newspaper },
  { label: "Announcements", href: "/admin/announcements", icon: Megaphone },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
];

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
