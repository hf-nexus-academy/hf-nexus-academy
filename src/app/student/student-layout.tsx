import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { PortalSidebar, PortalMobileNav } from "@/components/portal/shared/portal-sidebar";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const STUDENT_NAV = [
  { label: "Dashboard", href: "/student", iconName: "LayoutDashboard" },
  { label: "My Courses", href: "/student/courses", iconName: "BookOpen" },
  { label: "Assignments", href: "/student/assignments", iconName: "ClipboardList" },
  { label: "Attendance", href: "/student/attendance", iconName: "CalendarCheck" },
  { label: "Certificates", href: "/student/certificates", iconName: "Award" },
  { label: "Billing", href: "/student/billing", iconName: "CreditCard" },
  { label: "Notes", href: "/student/notes", iconName: "NotebookPen" },
  { label: "Profile", href: "/student/profile", iconName: "UserCircle" },
] as const;

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
