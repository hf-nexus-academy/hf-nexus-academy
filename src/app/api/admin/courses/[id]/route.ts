import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  isPublished: z.boolean().optional(),
  teacherId: z.string().optional(),
  title: z.string().min(2).max(200).optional(),
  subtitle: z.string().max(200).nullable().optional(),
  description: z.string().min(10).optional(),
  coverImageUrl: z.string().url().nullable().optional().or(z.literal("")),
  isFeatured: z.boolean().optional(),
  enrollmentOpen: z.boolean().optional(),
});

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input." }, { status: 400 });
    }

    const course = await prisma.course.findUnique({ where: { id } });
    if (!course) {
      return NextResponse.json({ error: "Course not found." }, { status: 404 });
    }

    await prisma.course.update({
      where: { id },
      data: {
        isPublished: parsed.data.isPublished,
        teacherId: parsed.data.teacherId,
        title: parsed.data.title,
        subtitle: parsed.data.subtitle,
        description: parsed.data.description,
        coverImageUrl:
          parsed.data.coverImageUrl !== undefined ? parsed.data.coverImageUrl || null : undefined,
        isFeatured: parsed.data.isFeatured,
        enrollmentOpen: parsed.data.enrollmentOpen,
      },
    });

    return NextResponse.json({ message: "Course updated." });
  } catch (error) {
    console.error("Admin update course error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
