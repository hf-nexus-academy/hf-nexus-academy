import { Megaphone } from "lucide-react";

import { getAllAnnouncements } from "@/lib/data/admin";
import { PortalSectionHeader } from "@/components/portal/shared/section-header";
import { PortalEmptyState } from "@/components/portal/shared/empty-state";
import { BroadcastAnnouncementForm } from "@/components/portal/admin/broadcast-announcement-form";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Broadcast Announcements" };

export default async function AdminAnnouncementsPage() {
  const announcements = await getAllAnnouncements();

  return (
    <div>
      <PortalSectionHeader
        title="Broadcast Announcements"
        description="Send a platform-wide announcement to students, teachers, or admins."
      />

      <div className="grid lg:grid-cols-[1fr_1.2fr] gap-8">
        <div className="rounded-lg border border-ink-300/15 bg-white p-6">
          <BroadcastAnnouncementForm />
        </div>

        <div>
          <h2 className="font-display text-base text-navy-950 mb-4">History</h2>
          {announcements.length === 0 ? (
            <PortalEmptyState
              icon={Megaphone}
              title="No announcements sent yet"
              description="Announcements you broadcast will be logged here."
            />
          ) : (
            <div className="flex flex-col gap-3">
              {announcements.map((a) => (
                <div key={a.id} className="rounded-lg border border-ink-300/15 bg-white p-5">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <p className="text-sm font-medium text-navy-950">{a.title}</p>
                    <span className="text-xs text-ink-300 shrink-0">{formatDate(a.createdAt)}</span>
                  </div>
                  <p className="text-sm text-ink-500 mb-3">{a.message}</p>
                  <div className="flex gap-1.5">
                    {a.audience.map((role) => (
                      <Badge key={role} variant="outline">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
