import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  title: z.string().min(2).max(150),
  message: z.string().min(2).max(1000),
  audience: z.array(z.enum(["ADMIN", "TEACHER", "STUDENT"])).min(1),
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

    const announcement = await prisma.announcement.create({
      data: { title: parsed.data.title, message: parsed.data.message, audience: parsed.data.audience },
    });

    const recipients = await prisma.user.findMany({
      where: { role: { in: parsed.data.audience }, isActive: true },
      select: { id: true },
    });

    if (recipients.length > 0) {
      await prisma.notification.createMany({
        data: recipients.map((u) => ({
          userId: u.id,
          type: "ANNOUNCEMENT" as const,
          title: parsed.data.title,
          message: parsed.data.message,
        })),
      });
    }

    return NextResponse.json(
      { message: `Announcement sent to ${recipients.length} user(s).`, announcement },
      { status: 201 }
    );
  } catch (error) {
    console.error("Admin broadcast announcement error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
