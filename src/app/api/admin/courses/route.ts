import { NextResponse } from "next/server";
import { z } from "zod";
import slugify from "slugify";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  title: z.string().min(2).max(150),
  subtitle: z.string().optional(),
  description: z.string().min(10).max(3000),
  category: z.enum(["QURAN", "HADITH", "FIQH", "ARABIC", "ISLAMIC_FOUNDATIONS", "AQEEDAH", "LOGIC"]),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).default("BEGINNER"),
  durationWeeks: z.coerce.number().int().min(1).optional(),
  teacherId: z.string().optional(),
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
    while (await prisma.course.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${suffix++}`;
    }

    const course = await prisma.course.create({
      data: { ...parsed.data, slug, teacherId: parsed.data.teacherId || undefined },
    });

    return NextResponse.json({ message: "Course created.", course }, { status: 201 });
  } catch (error) {
    console.error("Admin create course error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
