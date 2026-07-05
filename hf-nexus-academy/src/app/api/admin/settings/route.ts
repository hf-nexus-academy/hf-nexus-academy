import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  whatsappNumber: z.string().max(30).optional(),
  contactEmail: z.string().max(200).optional(),
  contactPhone: z.string().max(30).optional(),
  facebookUrl: z.string().max(300).optional(),
  instagramUrl: z.string().max(300).optional(),
  youtubeUrl: z.string().max(300).optional(),
  tiktokUrl: z.string().max(300).optional(),
  twitterUrl: z.string().max(300).optional(),
  logoUrl: z.string().max(500).optional(),
  faviconUrl: z.string().max(500).optional(),
  metaTitle: z.string().max(200).optional(),
  metaDescription: z.string().max(500).optional(),
  footerTagline: z.string().max(300).optional(),
  googleAnalyticsId: z.string().max(50).optional(),
  googleVerificationId: z.string().max(200).optional(),
});

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input.", details: parsed.error.flatten() }, { status: 400 });
    }

    await prisma.siteSettings.upsert({
      where: { key: "global" },
      update: parsed.data,
      create: { key: "global", ...parsed.data },
    });

    return NextResponse.json({ message: "Settings updated." });
  } catch (error) {
    console.error("Admin update site settings error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
