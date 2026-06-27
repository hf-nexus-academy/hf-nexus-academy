import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "STUDENT") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const student = await prisma.student.findUnique({ where: { userId: session.user.id } });
    if (!student) {
      return NextResponse.json({ error: "Student profile not found." }, { status: 404 });
    }

    const note = await prisma.studentNote.findUnique({ where: { id: params.id } });
    if (!note || note.studentId !== student.id) {
      return NextResponse.json({ error: "Note not found." }, { status: 404 });
    }

    await prisma.studentNote.delete({ where: { id: params.id } });

    return NextResponse.json({ message: "Note deleted." });
  } catch (error) {
    console.error("Delete note error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
