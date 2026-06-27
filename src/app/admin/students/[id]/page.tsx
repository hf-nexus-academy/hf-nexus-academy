import { notFound } from "next/navigation";
import { CreditCard, BookOpen, Award } from "lucide-react";

import { getStudentFullDetail, getAllCourses } from "@/lib/data/admin";
import { PortalSectionHeader } from "@/components/portal/shared/section-header";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { EnrollStudentDialog } from "@/components/portal/admin/enroll-student-dialog";
import { UserStatusToggle } from "@/components/portal/admin/user-status-toggle";
import { getInitials, formatDate, formatCurrency } from "@/lib/utils";

export async function generateMetadata() {
  return { title: "Student Detail" };
}

export default async function AdminStudentDetailPage({ params }: { params: { id: string } }) {
  const student = await getStudentFullDetail(params.id);
  if (!student) notFound();

  const allCourses = await getAllCourses();
  const enrolledCourseIds = new Set(student.enrollments.map((e) => e.courseId));
  const availableCourses = allCourses.filter((c) => !enrolledCourseIds.has(c.id));

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14">
            <AvatarFallback className="text-base">{getInitials(student.user.name)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-display text-2xl text-navy-950">{student.user.name}</h1>
            <p className="text-sm text-ink-500">{student.user.email}</p>
          </div>
        </div>
        <UserStatusToggle
          userId={student.user.id}
          initialActive={student.user.isActive}
          endpoint={`/api/admin/students/${student.id}`}
        />
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="rounded-lg border border-ink-300/15 bg-white p-5">
          <p className="text-xs text-ink-500">Country</p>
          <p className="text-sm font-medium text-navy-950 mt-1">{student.user.country ?? "—"}</p>
        </div>
        <div className="rounded-lg border border-ink-300/15 bg-white p-5">
          <p className="text-xs text-ink-500">WhatsApp</p>
          <p className="text-sm font-medium text-navy-950 mt-1">{student.user.whatsapp ?? "—"}</p>
        </div>
        <div className="rounded-lg border border-ink-300/15 bg-white p-5">
          <p className="text-xs text-ink-500">Joined</p>
          <p className="text-sm font-medium text-navy-950 mt-1">{formatDate(student.joinedAt)}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-lg border border-ink-300/15 bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-base text-navy-950 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-gold-600" /> Enrollments
            </h2>
            {availableCourses.length > 0 && (
              <EnrollStudentDialog
                studentId={student.id}
                courses={availableCourses.map((c) => ({ id: c.id, title: c.title }))}
              />
            )}
          </div>
          {student.enrollments.length === 0 ? (
            <p className="text-sm text-ink-500">No enrollments yet.</p>
          ) : (
            <div className="flex flex-col divide-y divide-ink-300/10">
              {student.enrollments.map((e) => (
                <div key={e.id} className="flex items-center justify-between py-2.5">
                  <span className="text-sm text-navy-950">{e.course.title}</span>
                  <Badge variant="outline">{e.progress}%</Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-lg border border-ink-300/15 bg-white p-6">
          <h2 className="font-display text-base text-navy-950 flex items-center gap-2 mb-4">
            <CreditCard className="h-4 w-4 text-gold-600" /> Payment History
          </h2>
          {student.payments.length === 0 ? (
            <p className="text-sm text-ink-500">No payments recorded yet.</p>
          ) : (
            <div className="flex flex-col divide-y divide-ink-300/10">
              {student.payments.map((p) => (
                <div key={p.id} className="flex items-center justify-between py-2.5">
                  <div>
                    <p className="text-sm text-navy-950">{p.plan}</p>
                    <p className="text-xs text-ink-300">{formatDate(p.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-navy-950">
                      {formatCurrency(p.amountCents, p.currency)}
                    </p>
                    <Badge variant={p.status === "SUCCEEDED" ? "success" : "outline"}>{p.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-lg border border-ink-300/15 bg-white p-6 mt-6">
        <h2 className="font-display text-base text-navy-950 flex items-center gap-2 mb-4">
          <Award className="h-4 w-4 text-gold-600" /> Certificates
        </h2>
        {student.certificates.length === 0 ? (
          <p className="text-sm text-ink-500">No certificates issued yet.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {student.certificates.map((c) => (
              <Badge key={c.id} variant="gold">
                {c.courseTitle}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
