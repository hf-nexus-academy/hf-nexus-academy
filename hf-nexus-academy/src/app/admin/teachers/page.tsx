import Link from "next/link";
import { GraduationCap, ArrowRight } from "lucide-react";

import { getAllTeachers } from "@/lib/data/admin";
import { PortalSectionHeader } from "@/components/portal/shared/section-header";
import { PortalEmptyState } from "@/components/portal/shared/empty-state";
import { CreateTeacherDialog } from "@/components/portal/admin/create-teacher-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getInitials } from "@/lib/utils";

export const metadata = { title: "Manage Teachers" };

export default async function AdminTeachersPage() {
  const teachers = await getAllTeachers();

  return (
    <div>
      <PortalSectionHeader
        title="Manage Teachers"
        description={`${teachers.length} teacher${teachers.length === 1 ? "" : "s"} on the platform.`}
        action={<CreateTeacherDialog />}
      />

      {teachers.length === 0 ? (
        <PortalEmptyState
          icon={GraduationCap}
          title="No teachers added yet"
          description="Use the Add Teacher button to create your first teacher account."
        />
      ) : (
        <div className="rounded-lg border border-ink-300/15 bg-white divide-y divide-ink-300/10">
          {teachers.map((teacher) => (
            <Link
              key={teacher.id}
              href={`/admin/teachers/${teacher.id}`}
              className="flex items-center justify-between gap-4 p-5 hover:bg-cream-50 transition-colors"
            >
              <div className="flex items-center gap-4 min-w-0">
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarFallback>{getInitials(teacher.user.name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-navy-950 truncate">{teacher.user.name}</p>
                  <p className="text-xs text-ink-500 truncate">{teacher.user.email}</p>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-3 shrink-0">
                <Badge variant="outline">{teacher.courses.length} course(s)</Badge>
                <Badge variant={teacher.isPublished ? "success" : "outline"}>
                  {teacher.isPublished ? "Published" : "Hidden"}
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
