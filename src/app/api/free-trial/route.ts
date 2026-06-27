import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { sendContactLeadNotification } from "@/lib/email";

const freeTrialSchema = z.object({
  fullName: z.string().min(2).max(100),
  email: z.string().email(),
  whatsapp: z.string().min(5).max(30),
  country: z.string().min(1),
  age: z.coerce.number().int().min(3).max(100).optional(),
  courseInterest: z.enum([
    "QURAN",
    "HADITH",
    "FIQH",
    "ARABIC",
    "ISLAMIC_FOUNDATIONS",
    "AQEEDAH",
    "LOGIC",
  ]),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = freeTrialSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const lead = await prisma.contactLead.create({
      data: {
        fullName: data.fullName,
        email: data.email.toLowerCase(),
        whatsapp: data.whatsapp,
        country: data.country,
        age: data.age,
        courseInterest: data.courseInterest,
        source: "free_trial",
      },
    });

    await sendContactLeadNotification(data.fullName, data.email, data.courseInterest);

    return NextResponse.json(
      { message: "Your free trial request has been received. We'll contact you shortly.", id: lead.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Free trial submission error:", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
