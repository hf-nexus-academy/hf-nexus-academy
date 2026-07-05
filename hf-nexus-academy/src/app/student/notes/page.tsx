import { auth } from "@/lib/auth";
import { getStudentByUserId, getStudentNotes } from "@/lib/data/student";
import { PortalSectionHeader } from "@/components/portal/shared/section-header";
import { StudentNotesManager } from "@/components/portal/student/notes-manager";

export const metadata = { title: "My Notes" };

export default async function StudentNotesPage() {
  const session = await auth();
  const student = await getStudentByUserId(session!.user.id);
  const notes = student ? await getStudentNotes(student.id) : [];

  return (
    <div>
      <PortalSectionHeader title="My Notes" description="Personal notes saved during your studies." />
      <StudentNotesManager initialNotes={notes} />
    </div>
  );
}
