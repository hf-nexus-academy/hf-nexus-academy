import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  isPublished: z.boolean().optional(),
  isActive: z.boolean().optional(),
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

    const teacher = await prisma.teacher.findUnique({ where: { id: params.id } });
    if (!teacher) {
      return NextResponse.json({ error: "Teacher not found." }, { status: 404 });
    }

    if (parsed.data.isPublished !== undefined) {
      await prisma.teacher.update({ where: { id: params.id }, data: { isPublished: parsed.data.isPublished } });
    }

    if (parsed.data.isActive !== undefined) {
      await prisma.user.update({ where: { id: teacher.userId }, data: { isActive: parsed.data.isActive } });
    }

    return NextResponse.json({ message: "Teacher updated." });
  } catch (error) {
    console.error("Admin update teacher error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
