import { auth } from "@/lib/auth";
import { getTeacherByUserId, getTeacherCourses } from "@/lib/data/teacher";
import { PortalSectionHeader } from "@/components/portal/shared/section-header";
import { SendNotificationForm } from "@/components/portal/teacher/send-notification-form";

export const metadata = { title: "Send Notifications" };

export default async function TeacherNotificationsPage() {
  const session = await auth();
  const teacher = await getTeacherByUserId(session!.user.id);
  const courses = teacher ? await getTeacherCourses(teacher.id) : [];

  return (
    <div>
      <PortalSectionHeader
        title="Send Notifications"
        description="Broadcast an announcement to all active students in one of your courses."
      />
      <SendNotificationForm courses={courses.map((c) => ({ id: c.id, title: c.title }))} />
    </div>
  );
}
