import { notFound } from "next/navigation";
import { BookOpen } from "lucide-react";

import { getTeacherFullDetail } from "@/lib/data/admin";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PublishToggle } from "@/components/portal/admin/publish-toggle";
import { UserStatusToggle } from "@/components/portal/admin/user-status-toggle";
import { getInitials } from "@/lib/utils";

export async function generateMetadata() {
  return { title: "Teacher Detail" };
}

export default async function AdminTeacherDetailPage({ params }: { params: { id: string } }) {
  const teacher = await getTeacherFullDetail(params.id);
  if (!teacher) notFound();

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14">
            <AvatarFallback className="text-base">{getInitials(teacher.user.name)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-display text-2xl text-navy-950">{teacher.user.name}</h1>
            <p className="text-sm text-ink-500">{teacher.user.email}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <UserStatusToggle
            userId={teacher.user.id}
            initialActive={teacher.user.isActive}
            endpoint={`/api/admin/teachers/${teacher.id}`}
          />
          <PublishToggle
            initialPublished={teacher.isPublished}
            endpoint={`/api/admin/teachers/${teacher.id}`}
            field="isPublished"
            label="Published on site"
          />
        </div>
      </div>

      <div className="rounded-lg border border-ink-300/15 bg-white p-6 mb-6">
        <h2 className="font-display text-base text-navy-950 mb-3">Biography</h2>
        <p className="text-sm text-ink-500 leading-relaxed mb-4">{teacher.bio}</p>
        <div className="flex flex-wrap gap-2">
          {teacher.specializations.map((s) => (
            <Badge key={s} variant="gold">
              {s}
            </Badge>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-ink-300/15 bg-white p-6">
        <h2 className="font-display text-base text-navy-950 flex items-center gap-2 mb-4">
          <BookOpen className="h-4 w-4 text-gold-600" /> Courses Taught
        </h2>
        {teacher.courses.length === 0 ? (
          <p className="text-sm text-ink-500">No courses assigned yet.</p>
        ) : (
          <div className="flex flex-col divide-y divide-ink-300/10">
            {teacher.courses.map((course) => (
              <div key={course.id} className="flex items-center justify-between py-2.5">
                <span className="text-sm text-navy-950">{course.title}</span>
                <Badge variant="outline">{course.enrollments.length} students</Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
