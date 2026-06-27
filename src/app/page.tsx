import type { Metadata } from "next";

import { Hero } from "@/components/home/hero";
import { TrustBar } from "@/components/home/trust-bar";
import { WhyHfNexus } from "@/components/home/why-hf-nexus";
import { CoursesOverview } from "@/components/home/courses-overview";
import { MeetScholars } from "@/components/home/meet-scholars";
import { StudentJourney } from "@/components/home/student-journey";
import { Testimonials } from "@/components/home/testimonials";
import { PricingPreview } from "@/components/home/pricing-preview";
import { Faq } from "@/components/home/faq";
import { FinalCta } from "@/components/home/final-cta";
import { OrganizationSchema } from "@/components/shared/organization-schema";

export const metadata: Metadata = {
  title: "Online Quran, Hadith, Fiqh & Arabic Classes for Students Worldwide",
  description:
    "Learn authentic Islamic knowledge through live online classes taught by qualified scholars. Quran, Hadith, Fiqh, Arabic, and Logic courses for students worldwide.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <OrganizationSchema />
      <Hero />
      <TrustBar />
      <WhyHfNexus />
      <CoursesOverview />
      <MeetScholars />
      <StudentJourney />
      <Testimonials />
      <PricingPreview />
      <Faq />
      <FinalCta />
    </>
  );
}
