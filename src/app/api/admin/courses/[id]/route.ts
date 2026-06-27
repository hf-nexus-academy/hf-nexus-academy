import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  isPublished: z.boolean().optional(),
  teacherId: z.string().optional(),
});

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
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

    const course = await prisma.course.findUnique({ where: { id: params.id } });
    if (!course) {
      return NextResponse.json({ error: "Course not found." }, { status: 404 });
    }

    await prisma.course.update({
      where: { id: params.id },
      data: {
        isPublished: parsed.data.isPublished,
        teacherId: parsed.data.teacherId,
      },
    });

    return NextResponse.json({ message: "Course updated." });
  } catch (error) {
    console.error("Admin update course error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
