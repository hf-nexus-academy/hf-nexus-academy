import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  question: z.string().min(5).max(300),
  answer: z.string().min(5).max(2000),
  placement: z.string().min(1).default("general"),
  displayOrder: z.coerce.number().int().default(0),
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
      return NextResponse.json({ error: "Invalid input.", details: parsed.error.flatten() }, { status: 400 });
    }

    const faq = await prisma.faq.create({ data: parsed.data });

    return NextResponse.json({ message: "FAQ added.", faq }, { status: 201 });
  } catch (error) {
    console.error("Admin create FAQ error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
