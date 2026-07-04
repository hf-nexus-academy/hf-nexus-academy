import type { Metadata } from "next";
import { CourseCategoryPage } from "@/components/shared/course-category-page";

export const metadata: Metadata = {
  title: "Hadith Courses — Forty Hadith, Riyadh us Saliheen, Methodology",
  description:
    "Online Hadith classes covering Forty Hadith, Riyadh us Saliheen, and Hadith methodology, taught live by qualified scholars.",
  alternates: { canonical: "/courses/hadith" },
};

export const revalidate = 60;

export default function HadithCoursesPage() {
  return <CourseCategoryPage category="hadith" />;
}
