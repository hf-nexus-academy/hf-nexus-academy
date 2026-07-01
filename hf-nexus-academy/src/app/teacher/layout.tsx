import type { Metadata } from "next";
import { redirect } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Video,
  ClipboardList,
  CalendarCheck,
  Bell,
  FolderOpen,
} from "lucide-react";

import { auth } from "@/lib/auth";
import { PortalSidebar, PortalMobileNav, type PortalNavItem } from "@/components/portal/shared/portal-sidebar";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const TEACHER_NAV: PortalNavItem[] = [
  { label: "Dashboard", href: "/teacher", icon: LayoutDashboard },
  { label: "Students", href: "/teacher/students", icon: Users },
  { label: "Lessons", href: "/teacher/lessons", icon: Video },
  { label: "Assignments", href: "/teacher/assignments", icon: ClipboardList },
  { label: "Attendance", href: "/teacher/attendance", icon: CalendarCheck },
  { label: "Notifications", href: "/teacher/notifications", icon: Bell },
  { label: "Resources", href: "/teacher/resources", icon: FolderOpen },
];

export default async function TeacherLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user || (session.user.role !== "TEACHER" && session.user.role !== "ADMIN")) {
    redirect("/login?callbackUrl=/teacher");
  }

  return (
    <div className="flex bg-cream-100 min-h-[calc(100vh-5rem)]">
      <PortalSidebar navItems={TEACHER_NAV} portalLabel="Teacher Portal" />
      <div className="flex-1 flex flex-col">
        <PortalMobileNav navItems={TEACHER_NAV} />
        <main className="flex-1 p-5 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
