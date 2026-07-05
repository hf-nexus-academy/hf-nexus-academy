import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  isPublished: z.boolean().optional(),
  isActive: z.boolean().optional(),
  title: z.string().max(50).optional(),
  bio: z.string().min(10).max(4000).optional(),
  specializations: z.array(z.string().min(1)).optional(),
  experienceYears: z.number().int().min(0).max(80).nullable().optional(),
  photoUrl: z.string().url().nullable().optional().or(z.literal("")),
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

    const teacher = await prisma.teacher.findUnique({ where: { id } });
    if (!teacher) {
      return NextResponse.json({ error: "Teacher not found." }, { status: 404 });
    }

    if (parsed.data.isPublished !== undefined) {
      await prisma.teacher.update({ where: { id }, data: { isPublished: parsed.data.isPublished } });
    }

    if (parsed.data.isActive !== undefined) {
      await prisma.user.update({ where: { id: teacher.userId }, data: { isActive: parsed.data.isActive } });
    }

    const profileData: Record<string, unknown> = {};
    if (parsed.data.title !== undefined) profileData.title = parsed.data.title;
    if (parsed.data.bio !== undefined) profileData.bio = parsed.data.bio;
    if (parsed.data.specializations !== undefined) profileData.specializations = parsed.data.specializations;
    if (parsed.data.experienceYears !== undefined) profileData.experienceYears = parsed.data.experienceYears;
    if (parsed.data.photoUrl !== undefined) profileData.photoUrl = parsed.data.photoUrl || null;

    if (Object.keys(profileData).length > 0) {
      await prisma.teacher.update({ where: { id }, data: profileData });
    }

    return NextResponse.json({ message: "Teacher updated." });
  } catch (error) {
    console.error("Admin update teacher error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
