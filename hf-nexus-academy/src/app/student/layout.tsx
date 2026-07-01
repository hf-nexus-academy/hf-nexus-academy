import type { Metadata } from "next";
import { redirect } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  CalendarCheck,
  Award,
  NotebookPen,
  UserCircle,
  CreditCard,
} from "lucide-react";

import { auth } from "@/lib/auth";
import { PortalSidebar, PortalMobileNav, type PortalNavItem } from "@/components/portal/shared/portal-sidebar";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const STUDENT_NAV: PortalNavItem[] = [
  { label: "Dashboard", href: "/student", icon: LayoutDashboard },
  { label: "My Courses", href: "/student/courses", icon: BookOpen },
  { label: "Assignments", href: "/student/assignments", icon: ClipboardList },
  { label: "Attendance", href: "/student/attendance", icon: CalendarCheck },
  { label: "Certificates", href: "/student/certificates", icon: Award },
  { label: "Billing", href: "/student/billing", icon: CreditCard },
  { label: "Notes", href: "/student/notes", icon: NotebookPen },
  { label: "Profile", href: "/student/profile", icon: UserCircle },
];

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user || session.user.role !== "STUDENT") {
    redirect("/login?callbackUrl=/student");
  }

  return (
    <div className="flex bg-cream-100 min-h-[calc(100vh-5rem)]">
      <PortalSidebar navItems={STUDENT_NAV} portalLabel="Student Portal" />
      <div className="flex-1 flex flex-col">
        <PortalMobileNav navItems={STUDENT_NAV} />
        <main className="flex-1 p-5 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
