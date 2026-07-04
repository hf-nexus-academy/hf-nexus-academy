import { Award, Download } from "lucide-react";

import { auth } from "@/lib/auth";
import { getStudentByUserId, getStudentCertificates } from "@/lib/data/student";
import { PortalSectionHeader } from "@/components/portal/shared/section-header";
import { PortalEmptyState } from "@/components/portal/shared/empty-state";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Certificates" };

export default async function StudentCertificatesPage() {
  const session = await auth();
  const student = await getStudentByUserId(session!.user.id);
  const certificates = student ? await getStudentCertificates(student.id) : [];

  return (
    <div>
      <PortalSectionHeader title="Certificates" description="Certificates earned upon course completion." />

      {certificates.length === 0 ? (
        <PortalEmptyState
          icon={Award}
          title="No certificates yet"
          description="Complete a course to earn your first certificate of completion from HF Nexus Academy."
        />
      ) : (
        <div className="grid sm:grid-cols-2 gap-5">
          {certificates.map((cert) => (
            <div key={cert.id} className="rounded-lg border border-gold-500/30 bg-white p-6 flex flex-col">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gold-100 text-gold-700 mb-4">
                <Award className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg text-navy-950 mb-1">{cert.courseTitle}</h3>
              <p className="text-xs text-ink-500 mb-1">Certificate No. {cert.certificateNo}</p>
              <p className="text-xs text-ink-300 mb-4">Issued {formatDate(cert.issuedAt)}</p>
              {cert.fileUrl ? (
                <a
                  href={cert.fileUrl}
                  className="inline-flex items-center gap-2 text-sm font-medium text-gold-700 hover:underline mt-auto"
                >
                  <Download className="h-4 w-4" /> Download
                </a>
              ) : (
                <p className="text-xs text-ink-300 mt-auto">Download link pending</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
