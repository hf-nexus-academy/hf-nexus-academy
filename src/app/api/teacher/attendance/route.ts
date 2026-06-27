import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  studentId: z.string().min(1),
  courseId: z.string().min(1),
  status: z.enum(["PRESENT", "ABSENT", "LATE", "EXCUSED"]),
  date: z.string().optional(),
  notes: z.string().optional(),
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
    if (!teacher) {
      return NextResponse.json({ error: "Teacher profile not found." }, { status: 404 });
    }

    // Verify the student is actually enrolled in a course taught by this teacher
    const enrollment = await prisma.enrollment.findFirst({
      where: { studentId: parsed.data.studentId, courseId: parsed.data.courseId, course: { teacherId: teacher.id } },
    });

    if (!enrollment) {
      return NextResponse.json({ error: "Student is not enrolled in this course under your teaching." }, { status: 403 });
    }

    const attendance = await prisma.attendance.create({
      data: {
        studentId: parsed.data.studentId,
        teacherId: teacher.id,
        courseId: parsed.data.courseId,
        status: parsed.data.status,
        date: parsed.data.date ? new Date(parsed.data.date) : new Date(),
        notes: parsed.data.notes,
      },
    });

    return NextResponse.json({ message: "Attendance recorded.", id: attendance.id }, { status: 201 });
  } catch (error) {
    console.error("Mark attendance error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
