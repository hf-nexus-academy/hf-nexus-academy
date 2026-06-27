import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  studentId: z.string().min(1),
  courseId: z.string().min(1),
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
      return NextResponse.json({ error: "Invalid input." }, { status: 400 });
    }

    const existing = await prisma.enrollment.findUnique({
      where: { studentId_courseId: { studentId: parsed.data.studentId, courseId: parsed.data.courseId } },
    });

    if (existing) {
      return NextResponse.json({ error: "Student is already enrolled in this course." }, { status: 409 });
    }

    const enrollment = await prisma.enrollment.create({
      data: { studentId: parsed.data.studentId, courseId: parsed.data.courseId },
    });

    return NextResponse.json({ message: "Student enrolled.", enrollment }, { status: 201 });
  } catch (error) {
    console.error("Admin create enrollment error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
