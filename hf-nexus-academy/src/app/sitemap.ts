import type { MetadataRoute } from "next";

import { prisma } from "@/lib/prisma";
import { CATEGORY_META } from "@/lib/courses-data";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://hf-nexus.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${APP_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${APP_URL}/about`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${APP_URL}/courses`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${APP_URL}/teachers`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${APP_URL}/pricing`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${APP_URL}/free-trial`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${APP_URL}/contact`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${APP_URL}/blog`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${APP_URL}/privacy-policy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${APP_URL}/terms`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${APP_URL}/refund-policy`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const categoryPages: MetadataRoute.Sitemap = Object.keys(CATEGORY_META).map((category) => ({
    url: `${APP_URL}/courses/${category}`,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  let teacherPages: MetadataRoute.Sitemap = [];
  try {
    const teachers = await prisma.teacher.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
    });
    teacherPages = teachers.map((teacher) => ({
      url: `${APP_URL}/teachers/${teacher.slug}`,
      lastModified: teacher.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch (error) {
    console.error("Failed to load teachers for sitemap:", error);
  }

  let coursePages: MetadataRoute.Sitemap = [];
  try {
    const courses = await prisma.course.findMany({
      where: { isPublished: true, priceMonthlyCents: { not: null } },
      select: { slug: true, updatedAt: true },
    });
    coursePages = courses.map((course) => ({
      url: `${APP_URL}/courses/${course.slug}/enroll`,
      lastModified: course.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.75,
    }));
  } catch (error) {
    console.error("Failed to load courses for sitemap:", error);
  }

  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const posts = await prisma.blogPost.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
    });
    blogPages = posts.map((post) => ({
      url: `${APP_URL}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch (error) {
    console.error("Failed to load blog posts for sitemap:", error);
  }

  return [...staticPages, ...categoryPages, ...teacherPages, ...coursePages, ...blogPages];
}
