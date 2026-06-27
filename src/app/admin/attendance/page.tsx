import { CalendarCheck } from "lucide-react";

import { getAllAttendanceRecords } from "@/lib/data/admin";
import { PortalSectionHeader } from "@/components/portal/shared/section-header";
import { PortalEmptyState } from "@/components/portal/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Attendance Overview" };

const STATUS_VARIANT: Record<string, "success" | "warning" | "destructive" | "outline"> = {
  PRESENT: "success",
  LATE: "warning",
  ABSENT: "destructive",
  EXCUSED: "outline",
};

export default async function AdminAttendancePage() {
  const records = await getAllAttendanceRecords();

  return (
    <div>
      <PortalSectionHeader title="Attendance Overview" description="Most recent attendance records across all teachers." />

      {records.length === 0 ? (
        <PortalEmptyState
          icon={CalendarCheck}
          title="No attendance records yet"
          description="Attendance marked by teachers across all courses will appear here."
        />
      ) : (
        <div className="rounded-lg border border-ink-300/15 bg-white overflow-x-auto">
          <table className="w-full text-sm min-w-[560px]">
            <thead className="bg-cream-100 text-ink-500 text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left px-5 py-3 font-medium">Student</th>
                <th className="text-left px-5 py-3 font-medium">Teacher</th>
                <th className="text-left px-5 py-3 font-medium">Date</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-300/10">
              {records.map((r) => (
                <tr key={r.id}>
                  <td className="px-5 py-3.5 text-navy-950">{r.student.user.name}</td>
                  <td className="px-5 py-3.5 text-ink-500">{r.teacher.user.name}</td>
                  <td className="px-5 py-3.5 text-ink-300">{formatDate(r.date)}</td>
                  <td className="px-5 py-3.5">
                    <Badge variant={STATUS_VARIANT[r.status]}>{r.status}</Badge>
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
