import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  courseId: z.string().min(1),
  title: z.string().min(2).max(200),
  description: z.string().max(2000).optional(),
  videoUrl: z.string().url().optional().or(z.literal("")),
  resourceUrl: z.string().url().optional().or(z.literal("")),
  durationMins: z.coerce.number().int().min(1).optional(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user || (session.user.role !== "TEACHER" && session.user.role !== "ADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const teacher = await prisma.teacher.findUnique({ where: { userId: session.user.id } });
  if (!teacher) return NextResponse.json({ error: "Teacher profile not found." }, { status: 404 });

  const courses = await prisma.course.findMany({ where: { teacherId: teacher.id }, select: { id: true, title: true } });
  return NextResponse.json({ courses });
}

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

    const course = await prisma.course.findFirst({ where: { id: parsed.data.courseId, teacherId: teacher.id } });
    if (!course) {
      return NextResponse.json({ error: "You do not have access to this course." }, { status: 403 });
    }

    const lessonCount = await prisma.lesson.count({ where: { courseId: course.id } });

    const lesson = await prisma.lesson.create({
      data: {
        courseId: course.id,
        teacherId: teacher.id,
        title: parsed.data.title,
        description: parsed.data.description,
        videoUrl: parsed.data.videoUrl || undefined,
        resourceUrl: parsed.data.resourceUrl || undefined,
        durationMins: parsed.data.durationMins,
        order: lessonCount,
      },
    });

    return NextResponse.json({ message: "Lesson created.", lesson }, { status: 201 });
  } catch (error) {
    console.error("Create lesson error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
