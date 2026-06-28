import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  isActive: z.boolean().optional(),
  age: z.coerce.number().int().min(3).max(100).optional(),
});

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
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

    const student = await prisma.student.findUnique({ where: { id } });
    if (!student) {
      return NextResponse.json({ error: "Student not found." }, { status: 404 });
    }

    if (parsed.data.isActive !== undefined) {
      await prisma.user.update({ where: { id: student.userId }, data: { isActive: parsed.data.isActive } });
    }

    if (parsed.data.age !== undefined) {
      await prisma.student.update({ where: { id }, data: { age: parsed.data.age } });
    }

    return NextResponse.json({ message: "Student updated." });
  } catch (error) {
    console.error("Admin update student error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
