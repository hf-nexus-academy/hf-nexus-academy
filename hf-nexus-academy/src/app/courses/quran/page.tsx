import type { Metadata } from "next";
import { CourseCategoryPage } from "@/components/shared/course-category-page";

export const metadata: Metadata = {
  title: "Quran Courses — Nazirah, Tajweed, Hifz, Tafsir",
  description:
    "Online Quran classes covering Nazirah, Tajweed, Hifz memorization support, and Tafsir basics, taught live by qualified scholars.",
  alternates: { canonical: "/courses/quran" },
};

export const revalidate = 60;

export default function QuranCoursesPage() {
  return <CourseCategoryPage category="quran" />;
}
