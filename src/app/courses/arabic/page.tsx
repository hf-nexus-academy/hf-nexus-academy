import type { Metadata } from "next";
import { CourseCategoryPage } from "@/components/shared/course-category-page";

export const metadata: Metadata = {
  title: "Arabic Language Courses — Reading, Grammar, Vocabulary, Conversation",
  description:
    "Online Arabic language classes covering reading, grammar, vocabulary, and conversation, taught live by qualified scholars.",
  alternates: { canonical: "/courses/arabic" },
};

export default function ArabicCoursesPage() {
  return <CourseCategoryPage category="arabic" />;
}
