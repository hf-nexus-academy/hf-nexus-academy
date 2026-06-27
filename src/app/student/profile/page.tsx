import { auth } from "@/lib/auth";
import { getStudentByUserId, getStudentEnrollments } from "@/lib/data/student";
import { PortalSectionHeader } from "@/components/portal/shared/section-header";
import { ProfileForm } from "@/components/portal/student/profile-form";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";

export const metadata = { title: "My Profile" };

export default async function StudentProfilePage() {
  const session = await auth();
  const student = await getStudentByUserId(session!.user.id);
  const enrollments = student ? await getStudentEnrollments(student.id) : [];

  if (!student) return null;

  return (
    <div>
      <PortalSectionHeader title="My Profile" description="Manage your personal information." />

      <div className="grid lg:grid-cols-[1fr_1.2fr] gap-8">
        <div>
          <div className="flex items-center gap-4 mb-8">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg">{getInitials(student.user.name)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-display text-lg text-navy-950">{student.user.name}</p>
              <p className="text-sm text-ink-500">{student.user.email}</p>
            </div>
          </div>

          <ProfileForm
            email={student.user.email}
            defaultValues={{
              name: student.user.name,
              country: student.user.country,
              whatsapp: student.user.whatsapp,
              age: student.age,
            }}
          />
        </div>

        <div>
          <h3 className="font-display text-base text-navy-950 mb-4">Course Progress</h3>
          {enrollments.length === 0 ? (
            <p className="text-sm text-ink-500">No course enrollments yet.</p>
          ) : (
            <div className="flex flex-col gap-5">
              {enrollments.map((enrollment) => (
                <div key={enrollment.id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-navy-950">{enrollment.course.title}</span>
                    <span className="text-xs text-ink-500">{enrollment.progress}%</span>
                  </div>
                  <Progress value={enrollment.progress} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
