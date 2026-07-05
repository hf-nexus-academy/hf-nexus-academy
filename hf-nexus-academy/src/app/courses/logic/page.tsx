import type { Metadata } from "next";
import { CourseCategoryPage } from "@/components/shared/course-category-page";

export const metadata: Metadata = {
  title: "Logic (Mantiq) Courses — Introduction, Definitions, Reasoning, Classical Logic",
  description:
    "Online Logic (Mantiq) classes covering introduction, definitions, reasoning, and classical logic texts, taught live by qualified scholars.",
  alternates: { canonical: "/courses/logic" },
};

export default function LogicCoursesPage() {
  return <CourseCategoryPage category="logic" />;
}
