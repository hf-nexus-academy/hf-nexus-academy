import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  score: z.coerce.number().int().min(0),
  feedback: z.string().max(2000).optional(),
});

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "TEACHER" && session.user.role !== "ADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input." }, { status: 400 });
    }

    const teacher = await prisma.teacher.findUnique({ where: { userId: session.user.id } });
    if (!teacher) {
      return NextResponse.json({ error: "Teacher profile not found." }, { status: 404 });
    }

    const submission = await prisma.submission.findUnique({
      where: { id: params.id },
      include: { assignment: true },
    });

    if (!submission || submission.assignment.teacherId !== teacher.id) {
      return NextResponse.json({ error: "Submission not found." }, { status: 404 });
    }

    if (parsed.data.score > submission.assignment.maxScore) {
      return NextResponse.json(
        { error: `Score cannot exceed maximum of ${submission.assignment.maxScore}.` },
        { status: 400 }
      );
    }

    const updated = await prisma.submission.update({
      where: { id: params.id },
      data: {
        score: parsed.data.score,
        feedback: parsed.data.feedback,
        status: "GRADED",
        gradedAt: new Date(),
      },
    });

    // Notify the student
    const student = await prisma.student.findUnique({ where: { id: submission.studentId } });
    if (student) {
      await prisma.notification.create({
        data: {
          userId: student.userId,
          type: "ASSIGNMENT",
          title: "Assignment Graded",
          message: `Your submission for "${submission.assignment.title}" has been graded.`,
        },
      });
    }

    return NextResponse.json({ message: "Submission graded.", submission: updated });
  } catch (error) {
    console.error("Grade submission error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
