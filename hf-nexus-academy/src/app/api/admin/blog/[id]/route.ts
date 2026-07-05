import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  title: z.string().min(2).max(200).optional(),
  excerpt: z.string().min(10).max(500).optional(),
  content: z.string().min(20).optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  coverImageUrl: z.string().url().nullable().optional().or(z.literal("")),
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

    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Blog post not found." }, { status: 404 });
    }

    const becomingPublished = parsed.data.status === "PUBLISHED" && existing.status !== "PUBLISHED";

    await prisma.blogPost.update({
      where: { id },
      data: {
        ...parsed.data,
        coverImageUrl:
          parsed.data.coverImageUrl !== undefined ? parsed.data.coverImageUrl || null : undefined,
        publishedAt: becomingPublished ? new Date() : undefined,
      },
    });

    return NextResponse.json({ message: "Blog post updated." });
  } catch (error) {
    console.error("Admin update blog post error:", error);
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
    await prisma.blogPost.delete({ where: { id } });
    return NextResponse.json({ message: "Blog post deleted." });
  } catch (error) {
    console.error("Admin delete blog post error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
