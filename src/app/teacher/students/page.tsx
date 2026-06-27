import Link from "next/link";
import { Users, ArrowRight } from "lucide-react";

import { auth } from "@/lib/auth";
import { getTeacherByUserId, getTeacherStudents } from "@/lib/data/teacher";
import { PortalSectionHeader } from "@/components/portal/shared/section-header";
import { PortalEmptyState } from "@/components/portal/shared/empty-state";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getInitials } from "@/lib/utils";

export const metadata = { title: "My Students" };

export default async function TeacherStudentsPage() {
  const session = await auth();
  const teacher = await getTeacherByUserId(session!.user.id);
  const students = teacher ? await getTeacherStudents(teacher.id) : [];

  return (
    <div>
      <PortalSectionHeader title="My Students" description="Students enrolled in your courses." />

      {students.length === 0 ? (
        <PortalEmptyState
          icon={Users}
          title="No students yet"
          description="Students enrolled in your courses will appear here."
        />
      ) : (
        <div className="rounded-lg border border-ink-300/15 bg-white divide-y divide-ink-300/10">
          {students.map(({ student, courses }) => (
            <Link
              key={student.id}
              href={`/teacher/students/${student.id}`}
              className="flex items-center justify-between gap-4 p-5 hover:bg-cream-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>{getInitials(student.user.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-navy-950">{student.user.name}</p>
                  <p className="text-xs text-ink-500">{student.user.email}</p>
                </div>
              </div>
              <div className="hidden sm:flex flex-wrap gap-1.5 justify-end max-w-xs">
                {courses.map((c) => (
                  <Badge key={c} variant="outline">
                    {c}
                  </Badge>
                ))}
              </div>
              <ArrowRight className="h-4 w-4 text-gold-600 shrink-0" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
