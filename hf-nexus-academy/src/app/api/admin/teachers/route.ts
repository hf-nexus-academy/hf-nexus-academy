import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import slugify from "slugify";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  title: z.string().optional(),
  bio: z.string().min(10).max(2000),
  specializations: z.array(z.string()).min(1),
  experienceYears: z.coerce.number().int().min(0).max(60).optional(),
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

    const { name, email, title, bio, specializations, experienceYears } = parsed.data;
    const normalizedEmail = email.toLowerCase();

    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existing) {
      return NextResponse.json({ error: "A user with this email already exists." }, { status: 409 });
    }

    const tempPassword = Math.random().toString(36).slice(-10) + "A1!";
    const passwordHash = await bcrypt.hash(tempPassword, 12);

    const baseSlug = slugify(name, { lower: true, strict: true });
    let slug = baseSlug;
    let suffix = 1;
    while (await prisma.teacher.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${suffix++}`;
    }

    const user = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        passwordHash,
        role: "TEACHER",
        emailVerified: new Date(),
        teacher: {
          create: { slug, title, bio, specializations, experienceYears },
        },
      },
      include: { teacher: true },
    });

    return NextResponse.json(
      {
        message: "Teacher account created.",
        teacher: user.teacher,
        temporaryPassword: tempPassword,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Admin create teacher error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
