import type { MetadataRoute } from "next";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://hf-nexus.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/student",
        "/student/",
        "/teacher",
        "/teacher/",
        "/admin",
        "/admin/",
        "/api/",
        "/login",
        "/register",
        "/forgot-password",
        "/reset-password",
        "/verify-email",
        "/unauthorized",
      ],
    },
    sitemap: `${APP_URL}/sitemap.xml`,
  };
}
