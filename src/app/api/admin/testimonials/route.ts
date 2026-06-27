import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  studentName: z.string().min(2).max(100),
  country: z.string().optional(),
  courseTaken: z.string().optional(),
  quote: z.string().min(10).max(1000),
  rating: z.coerce.number().int().min(1).max(5).default(5),
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

    const testimonial = await prisma.testimonial.create({ data: parsed.data });

    return NextResponse.json({ message: "Testimonial added.", testimonial }, { status: 201 });
  } catch (error) {
    console.error("Admin create testimonial error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
