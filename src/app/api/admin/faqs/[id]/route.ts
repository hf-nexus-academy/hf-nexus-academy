import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  question: z.string().min(5).max(300).optional(),
  answer: z.string().min(5).max(2000).optional(),
  placement: z.string().min(1).optional(),
  displayOrder: z.coerce.number().int().optional(),
  isPublished: z.boolean().optional(),
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
      return NextResponse.json({ error: "Invalid input.", details: parsed.error.flatten() }, { status: 400 });
    }

    await prisma.faq.update({ where: { id }, data: parsed.data });

    return NextResponse.json({ message: "FAQ updated." });
  } catch (error) {
    console.error("Admin update FAQ error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.faq.delete({ where: { id } });
    return NextResponse.json({ message: "FAQ deleted." });
  } catch (error) {
    console.error("Admin delete FAQ error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
