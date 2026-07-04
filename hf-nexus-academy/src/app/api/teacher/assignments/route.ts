import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  lessonId: z.string().optional(),
  title: z.string().min(2).max(200),
  instructions: z.string().min(5).max(3000),
  dueAt: z.string().optional(),
  maxScore: z.coerce.number().int().min(1).max(1000).default(100),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "TEACHER" && session.user.role !== "ADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input.", details: parsed.error.flatten() }, { status: 400 });
    }

    const teacher = await prisma.teacher.findUnique({ where: { userId: session.user.id } });
    if (!teacher) return NextResponse.json({ error: "Teacher profile not found." }, { status: 404 });

    if (parsed.data.lessonId) {
      const lesson = await prisma.lesson.findFirst({
        where: { id: parsed.data.lessonId, teacherId: teacher.id },
      });
      if (!lesson) {
        return NextResponse.json({ error: "You do not have access to this lesson." }, { status: 403 });
      }
    }

    const assignment = await prisma.assignment.create({
      data: {
        lessonId: parsed.data.lessonId || undefined,
        teacherId: teacher.id,
        title: parsed.data.title,
        instructions: parsed.data.instructions,
        dueAt: parsed.data.dueAt ? new Date(parsed.data.dueAt) : undefined,
        maxScore: parsed.data.maxScore,
      },
    });

    return NextResponse.json({ message: "Assignment created.", assignment }, { status: 201 });
  } catch (error) {
    console.error("Create assignment error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
