import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  content: z.string().min(5).max(5000),
});

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();

  if (!session?.user || session.user.role !== "STUDENT") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid submission content." }, { status: 400 });
    }

    const student = await prisma.student.findUnique({ where: { userId: session.user.id } });
    if (!student) {
      return NextResponse.json({ error: "Student profile not found." }, { status: 404 });
    }

    const assignment = await prisma.assignment.findUnique({ where: { id: params.id } });
    if (!assignment) {
      return NextResponse.json({ error: "Assignment not found." }, { status: 404 });
    }

    const existing = await prisma.submission.findUnique({
      where: { assignmentId_studentId: { assignmentId: params.id, studentId: student.id } },
    });

    if (existing) {
      return NextResponse.json({ error: "You have already submitted this assignment." }, { status: 409 });
    }

    const isLate = assignment.dueAt ? new Date() > assignment.dueAt : false;

    const submission = await prisma.submission.create({
      data: {
        assignmentId: params.id,
        studentId: student.id,
        content: parsed.data.content,
        status: isLate ? "LATE" : "SUBMITTED",
      },
    });

    return NextResponse.json({ message: "Assignment submitted.", id: submission.id }, { status: 201 });
  } catch (error) {
    console.error("Assignment submission error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
