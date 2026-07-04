import { prisma } from "@/lib/prisma";
import { CourseCategory } from "@prisma/client";

function parseCourseCategory(category: string): CourseCategory | null {
  const upper = category.toUpperCase();
  return (Object.values(CourseCategory) as string[]).includes(upper)
    ? (upper as CourseCategory)
    : null;
}

/**
 * Public data layer.
 *
 * Every function here queries the database directly and only returns
 * isPublished (or equivalent) records, so draft/unpublished content set in
 * the admin portal never reaches a public page. Pages calling these should
 * set `export const revalidate = <seconds>` (ISR) so the database isn't hit
 * on every single request, while still staying fresh without a redeploy.
 */

export async function getPublishedCourses() {
  return prisma.course.findMany({
    where: { isPublished: true },
    include: {
      teacher: { select: { slug: true, user: { select: { name: true } } } },
    },
    orderBy: [{ category: "asc" }, { level: "asc" }, { title: "asc" }],
  });
}

export async function getPublishedCoursesByCategory(category: string) {
  const parsedCategory = parseCourseCategory(category);
  if (!parsedCategory) return [];

  return prisma.course.findMany({
    where: { isPublished: true, category: parsedCategory },
    include: {
      teacher: {
        select: { slug: true, title: true, bio: true, specializations: true, user: { select: { name: true } } },
      },
    },
    orderBy: [{ level: "asc" }, { title: "asc" }],
  });
}

export async function getPublishedCourseBySlug(slug: string) {
  return prisma.course.findFirst({
    where: { slug, isPublished: true },
    include: {
      teacher: {
        select: { slug: true, title: true, bio: true, specializations: true, user: { select: { name: true } } },
      },
      modules: { include: { lessons: { where: { isPublished: true }, orderBy: { order: "asc" } } }, orderBy: { order: "asc" } },
    },
  });
}

export async function getFeaturedCourses(limit = 6) {
  return prisma.course.findMany({
    where: { isPublished: true, isFeatured: true },
    include: {
      teacher: { select: { slug: true, user: { select: { name: true } } } },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getDistinctPublishedCategories() {
  const rows = await prisma.course.findMany({
    where: { isPublished: true },
    select: { category: true },
    distinct: ["category"],
  });
  return rows.map((r) => r.category);
}

export async function getPublishedTeachers() {
  return prisma.teacher.findMany({
    where: { isPublished: true },
    include: { user: { select: { name: true } } },
    orderBy: { displayOrder: "asc" },
  });
}

export async function getPublishedTeacherBySlug(slug: string) {
  return prisma.teacher.findFirst({
    where: { slug, isPublished: true },
    include: {
      user: { select: { name: true } },
      courses: { where: { isPublished: true }, select: { slug: true, title: true, category: true } },
    },
  });
}

export async function getPublishedPricingPlans() {
  return prisma.pricingPlan.findMany({
    where: { isPublished: true },
    orderBy: { displayOrder: "asc" },
  });
}

export async function getPublishedFaqs(placement = "general") {
  return prisma.faq.findMany({
    where: { isPublished: true, placement },
    orderBy: { displayOrder: "asc" },
  });
}

export async function getSiteSettings() {
  try {
    const settings = await prisma.siteSettings.findUnique({ where: { key: "global" } });
    return settings ?? {
      whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
      contactEmail: process.env.CONTACT_EMAIL ?? "",
      contactPhone: "",
      facebookUrl: "", instagramUrl: "", youtubeUrl: "", tiktokUrl: "", twitterUrl: "",
      logoUrl: "", faviconUrl: "",
      metaTitle: "HF Nexus Academy",
      metaDescription: "Premium online Islamic education — Quran, Hadith, Fiqh, Arabic, Aqeedah, and Logic, taught live by qualified scholars worldwide.",
      footerTagline: "Authentic Islamic education, delivered worldwide.",
      googleAnalyticsId: "", googleVerificationId: "",
    };
  } catch {
    return {
      whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
      contactEmail: "", contactPhone: "",
      facebookUrl: "", instagramUrl: "", youtubeUrl: "", tiktokUrl: "", twitterUrl: "",
      logoUrl: "", faviconUrl: "",
      metaTitle: "HF Nexus Academy",
      metaDescription: "Premium online Islamic education — Quran, Hadith, Fiqh, Arabic, Aqeedah, and Logic, taught live by qualified scholars worldwide.",
      footerTagline: "Authentic Islamic education, delivered worldwide.",
      googleAnalyticsId: "", googleVerificationId: "",
    };
  }
}

export async function getPublishedTestimonials() {
  try {
    return prisma.testimonial.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
      take: 6,
    });
  } catch { return []; }
}
