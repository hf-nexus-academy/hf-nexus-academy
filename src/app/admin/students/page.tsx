import Link from "next/link";
import { Users, ArrowRight } from "lucide-react";

import { getAllStudents } from "@/lib/data/admin";
import { PortalSectionHeader } from "@/components/portal/shared/section-header";
import { PortalEmptyState } from "@/components/portal/shared/empty-state";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getInitials, formatDate } from "@/lib/utils";

export const metadata = { title: "Manage Students" };

export default async function AdminStudentsPage() {
  const students = await getAllStudents();

  return (
    <div>
      <PortalSectionHeader
        title="Manage Students"
        description={`${students.length} total student${students.length === 1 ? "" : "s"} registered.`}
      />

      {students.length === 0 ? (
        <PortalEmptyState
          icon={Users}
          title="No students registered yet"
          description="Students who create an account will appear here."
        />
      ) : (
        <div className="rounded-lg border border-ink-300/15 bg-white divide-y divide-ink-300/10">
          {students.map((student) => (
            <Link
              key={student.id}
              href={`/admin/students/${student.id}`}
              className="flex items-center justify-between gap-4 p-5 hover:bg-cream-50 transition-colors"
            >
              <div className="flex items-center gap-4 min-w-0">
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarFallback>{getInitials(student.user.name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-navy-950 truncate">{student.user.name}</p>
                  <p className="text-xs text-ink-500 truncate">{student.user.email}</p>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-3 shrink-0">
                <Badge variant="outline">{student.enrollments.length} course(s)</Badge>
                <span className="text-xs text-ink-300">Joined {formatDate(student.joinedAt)}</span>
                <Badge variant={student.user.isActive ? "success" : "destructive"}>
                  {student.user.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <ArrowRight className="h-4 w-4 text-gold-600 shrink-0" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
