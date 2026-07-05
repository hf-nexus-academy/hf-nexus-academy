import { CalendarCheck } from "lucide-react";

import { auth } from "@/lib/auth";
import { getStudentByUserId, getStudentAttendance } from "@/lib/data/student";
import { PortalSectionHeader } from "@/components/portal/shared/section-header";
import { PortalEmptyState } from "@/components/portal/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Attendance" };

const STATUS_VARIANT: Record<string, "success" | "warning" | "destructive" | "outline"> = {
  PRESENT: "success",
  LATE: "warning",
  ABSENT: "destructive",
  EXCUSED: "outline",
};

export default async function StudentAttendancePage() {
  const session = await auth();
  const student = await getStudentByUserId(session!.user.id);
  const attendance = student ? await getStudentAttendance(student.id) : [];

  const presentCount = attendance.filter((a) => a.status === "PRESENT").length;
  const rate = attendance.length > 0 ? Math.round((presentCount / attendance.length) * 100) : null;

  return (
    <div>
      <PortalSectionHeader
        title="Attendance"
        description={rate !== null ? `Your attendance rate: ${rate}%` : "Your attendance history."}
      />

      {attendance.length === 0 ? (
        <PortalEmptyState
          icon={CalendarCheck}
          title="No attendance records yet"
          description="Once your classes begin, your attendance will be tracked here by your teacher."
        />
      ) : (
        <div className="rounded-lg border border-ink-300/15 bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-cream-100 text-ink-500 text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left px-5 py-3 font-medium">Date</th>
                <th className="text-left px-5 py-3 font-medium hidden sm:table-cell">Teacher</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-300/10">
              {attendance.map((record) => (
                <tr key={record.id}>
                  <td className="px-5 py-3.5 text-navy-950">{formatDate(record.date)}</td>
                  <td className="px-5 py-3.5 text-ink-500 hidden sm:table-cell">
                    {record.teacher.user.name}
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge variant={STATUS_VARIANT[record.status]}>{record.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
