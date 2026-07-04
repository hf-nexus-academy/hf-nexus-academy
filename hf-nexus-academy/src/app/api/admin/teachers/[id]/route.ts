import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  isPublished: z.boolean().optional(),
  isActive: z.boolean().optional(),
  name: z.string().min(1).optional(),
  title: z.string().optional(),
  bio: z.string().optional(),
  specializations: z.array(z.string()).optional(),
  experienceYears: z.number().int().nullable().optional(),
  photoUrl: z.string().nullable().optional(),
  slug: z.string().min(1).optional(),
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

    const teacher = await prisma.teacher.findUnique({ where: { id } });
    if (!teacher) {
      return NextResponse.json({ error: "Teacher not found." }, { status: 404 });
    }

    const { isPublished, isActive, name, ...teacherFields } = parsed.data;

    if (isActive !== undefined) {
      await prisma.user.update({ where: { id: teacher.userId }, data: { isActive } });
    }

    if (name !== undefined) {
      await prisma.user.update({ where: { id: teacher.userId }, data: { name } });
    }

    await prisma.teacher.update({
      where: { id },
      data: {
        isPublished,
        ...teacherFields,
      },
    });

    return NextResponse.json({ message: "Teacher updated." });
  } catch (error) {
    console.error("Admin update teacher error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
