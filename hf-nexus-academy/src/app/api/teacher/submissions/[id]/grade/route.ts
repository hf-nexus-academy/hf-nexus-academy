import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  score: z.coerce.number().int().min(0),
  feedback: z.string().max(2000).optional(),
});

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
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
      where: { id },
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
      where: { id },
      data: {
        score: parsed.data.score,
        feedback: parsed.data.feedback,
        status: "GRADED",
        gradedAt: new Date(),
      },
    });

    // Recalculate course progress: percentage of this course's assignments
    // (assignments attached to a lesson in the course) the student has had graded.
    // Assignments not attached to any lesson aren't tied to a specific course and
    // are excluded from this calculation.
    if (submission.assignment.lessonId) {
      const lesson = await prisma.lesson.findUnique({
        where: { id: submission.assignment.lessonId },
        select: { courseId: true },
      });

      if (lesson) {
        const courseAssignments = await prisma.assignment.findMany({
          where: { lesson: { courseId: lesson.courseId } },
          select: { id: true },
        });
        const assignmentIds = courseAssignments.map((a) => a.id);

        if (assignmentIds.length > 0) {
          const gradedCount = await prisma.submission.count({
            where: {
              studentId: submission.studentId,
              assignmentId: { in: assignmentIds },
              status: "GRADED",
            },
          });

          const progress = Math.round((gradedCount / assignmentIds.length) * 100);

          await prisma.enrollment.updateMany({
            where: { studentId: submission.studentId, courseId: lesson.courseId },
            data: { progress: Math.min(progress, 100) },
          });
        }
      }
    }

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
