import { NextResponse } from "next/server";
import { z } from "zod";
import slugify from "slugify";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  title: z.string().min(2).max(200),
  excerpt: z.string().min(10).max(500),
  content: z.string().min(20),
  category: z.enum(["QURAN", "HADITH", "FIQH", "ARABIC", "ISLAMIC_FOUNDATIONS", "AQEEDAH", "LOGIC"]),
  authorName: z.string().min(2).max(100),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
});

export async function POST(req: Request) {
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

    const baseSlug = slugify(parsed.data.title, { lower: true, strict: true });
    let slug = baseSlug;
    let suffix = 1;
    while (await prisma.blogPost.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${suffix++}`;
    }

    const post = await prisma.blogPost.create({
      data: {
        ...parsed.data,
        slug,
        publishedAt: parsed.data.status === "PUBLISHED" ? new Date() : undefined,
      },
    });

    return NextResponse.json({ message: "Blog post created.", post }, { status: 201 });
  } catch (error) {
    console.error("Admin create blog post error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
