import type { Metadata } from "next";
import { CourseCategoryPage } from "@/components/shared/course-category-page";

export const metadata: Metadata = {
  title: "Aqeedah Courses — Foundations, Sifat-e-Bari, Sharah Aqaid",
  description:
    "Online Aqeedah classes covering foundational Islamic beliefs, divine attributes, the classical text Sharah Aqaid, and comparative Aqeedah, taught live by qualified scholars.",
  alternates: { canonical: "/courses/aqeedah" },
};

export const revalidate = 60;

export default function AqeedahCoursesPage() {
  return <CourseCategoryPage category="aqeedah" />;
}
