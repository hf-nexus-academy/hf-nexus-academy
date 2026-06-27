import { FolderOpen, FileDown, Video } from "lucide-react";

import { auth } from "@/lib/auth";
import { getTeacherByUserId, getTeacherLessons } from "@/lib/data/teacher";
import { PortalSectionHeader } from "@/components/portal/shared/section-header";
import { PortalEmptyState } from "@/components/portal/shared/empty-state";

export const metadata = { title: "Manage Resources" };

export default async function TeacherResourcesPage() {
  const session = await auth();
  const teacher = await getTeacherByUserId(session!.user.id);
  const lessons = teacher ? await getTeacherLessons(teacher.id) : [];

  const lessonsWithResources = lessons.filter((l) => l.resourceUrl || l.videoUrl);

  return (
    <div>
      <PortalSectionHeader
        title="Manage Resources"
        description="Videos and downloadable resources attached to your lessons. Add new resources from the Lessons page."
      />

      {lessonsWithResources.length === 0 ? (
        <PortalEmptyState
          icon={FolderOpen}
          title="No resources added yet"
          description="When you upload a lesson with a video or resource link, it will appear here for quick reference."
        />
      ) : (
        <div className="rounded-lg border border-ink-300/15 bg-white divide-y divide-ink-300/10">
          {lessonsWithResources.map((lesson) => (
            <div key={lesson.id} className="flex items-center justify-between gap-4 p-5">
              <div>
                <p className="text-sm font-medium text-navy-950">{lesson.title}</p>
                <p className="text-xs text-ink-500 mt-0.5">{lesson.course.title}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {lesson.videoUrl && (
                  <a
                    href={lesson.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-gold-700 hover:underline"
                  >
                    <Video className="h-3.5 w-3.5" /> Video
                  </a>
                )}
                {lesson.resourceUrl && (
                  <a
                    href={lesson.resourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-gold-700 hover:underline"
                  >
                    <FileDown className="h-3.5 w-3.5" /> Resource
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
