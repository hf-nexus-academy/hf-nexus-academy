import type { Metadata } from "next";
import { CourseCategoryPage } from "@/components/shared/course-category-page";

export const metadata: Metadata = {
  title: "Fiqh Courses — Purification, Prayer, Fasting, Zakat, Transactions",
  description:
    "Online Fiqh classes covering purification, prayer, fasting, zakat, and transactions, taught live by qualified scholars.",
  alternates: { canonical: "/courses/fiqh" },
};

export default function FiqhCoursesPage() {
  return <CourseCategoryPage category="fiqh" />;
}
