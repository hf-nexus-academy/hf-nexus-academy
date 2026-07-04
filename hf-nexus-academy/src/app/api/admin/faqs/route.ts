import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
  placement: z.string().default("general"),
  isPublished: z.boolean().default(true),
  displayOrder: z.number().int().default(0),
});

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const faqs = await prisma.faq.findMany({ orderBy: [{ placement: "asc" }, { displayOrder: "asc" }] });
    return NextResponse.json({ faqs });
  } catch (error) {
    console.error("List FAQs error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Invalid input." }, { status: 400 });
    const faq = await prisma.faq.create({ data: parsed.data });
    return NextResponse.json({ faq }, { status: 201 });
  } catch (error) {
    console.error("Create FAQ error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
