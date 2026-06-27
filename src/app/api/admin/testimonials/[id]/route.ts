import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({ isPublished: z.boolean() });

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

    await prisma.testimonial.update({ where: { id: params.id }, data: { isPublished: parsed.data.isPublished } });

    return NextResponse.json({ message: "Testimonial updated." });
  } catch (error) {
    console.error("Admin update testimonial error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.testimonial.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "Testimonial deleted." });
  } catch (error) {
    console.error("Admin delete testimonial error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
