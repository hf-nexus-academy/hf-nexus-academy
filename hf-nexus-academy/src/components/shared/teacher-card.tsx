import Link from "next/link";
import { GraduationCap } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getInitials } from "@/lib/utils";

export interface TeacherCardData {
  slug: string;
  name: string;
  title?: string | null;
  bio: string;
  specializations: string[];
  experienceYears?: number | null;
  photoUrl?: string | null;
}

export function TeacherCard({ teacher }: { teacher: TeacherCardData }) {
  return (
    <Link
      href={`/teachers/${teacher.slug}`}
      className="group flex flex-col rounded-lg border border-ink-300/15 bg-white p-7 hover:border-gold-500/40 hover:shadow-md transition-all"
    >
      <div className="flex items-center gap-4 mb-5">
        <Avatar className="h-16 w-16 border-2 border-gold-500/30">
          {teacher.photoUrl && <AvatarImage src={teacher.photoUrl} alt={teacher.name} />}
          <AvatarFallback className="text-lg">{getInitials(teacher.name)}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-display text-lg text-navy-950">{teacher.name}</h3>
          {teacher.experienceYears && (
            <p className="text-xs text-ink-500 flex items-center gap-1.5 mt-1">
              <GraduationCap className="h-3.5 w-3.5 text-gold-600" />
              {teacher.experienceYears}+ years teaching
            </p>
          )}
        </div>
      </div>

      <p className="text-sm text-ink-500 leading-relaxed mb-5 line-clamp-3">{teacher.bio}</p>

      <div className="flex flex-wrap gap-2 mt-auto">
        {teacher.specializations.map((spec) => (
          <Badge key={spec} variant="gold">
            {spec}
          </Badge>
        ))}
      </div>
    </Link>
  );
}
