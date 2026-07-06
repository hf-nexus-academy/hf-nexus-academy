import { NextResponse } from "next/server";
import { z } from "zod";
import { nanoid } from "nanoid";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  studentId: z.string().min(1, "Select a student."),
  planKey: z.string().optional(),
  courseId: z.string().optional(),
  amountCents: z.coerce.number().int().min(1, "Enter an amount greater than 0."),
  currency: z.string().min(3).max(3).default("USD"),
  status: z.enum(["PENDING", "SUCCEEDED", "FAILED", "REFUNDED", "CANCELLED"]).default("SUCCEEDED"),
  note: z.string().max(300).optional(),
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

    if (!parsed.data.planKey && !parsed.data.courseId) {
      return NextResponse.json({ error: "Select either a plan or a course." }, { status: 400 });
    }

    const student = await prisma.student.findUnique({ where: { id: parsed.data.studentId } });
    if (!student) {
      return NextResponse.json({ error: "Student not found." }, { status: 404 });
    }

    const payment = await prisma.payment.create({
      data: {
        studentId: parsed.data.studentId,
        provider: "MANUAL",
        providerRef: `MANUAL-${nanoid(12)}`,
        planKey: parsed.data.planKey || null,
        courseId: parsed.data.courseId || null,
        amountCents: parsed.data.amountCents,
        currency: parsed.data.currency.toUpperCase(),
        status: parsed.data.status,
      },
    });

    return NextResponse.json({ message: "Payment recorded.", payment }, { status: 201 });
  } catch (error) {
    console.error("Admin record manual payment error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
