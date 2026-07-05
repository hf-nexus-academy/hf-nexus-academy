import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  courseId: z.string().min(1),
  title: z.string().min(2).max(150),
  message: z.string().min(2).max(1000),
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

    const course = await prisma.course.findFirst({ where: { id: parsed.data.courseId, teacherId: teacher.id } });
    if (!course) {
      return NextResponse.json({ error: "You do not have access to this course." }, { status: 403 });
    }

    const enrollments = await prisma.enrollment.findMany({
      where: { courseId: course.id, status: "ACTIVE" },
      include: { student: true },
    });

    if (enrollments.length === 0) {
      return NextResponse.json({ error: "No active students enrolled in this course." }, { status: 400 });
    }

    await prisma.notification.createMany({
      data: enrollments.map((e) => ({
        userId: e.student.userId,
        type: "ANNOUNCEMENT" as const,
        title: parsed.data.title,
        message: parsed.data.message,
      })),
    });

    return NextResponse.json({ message: `Notification sent to ${enrollments.length} student(s).` }, { status: 201 });
  } catch (error) {
    console.error("Send notification error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
