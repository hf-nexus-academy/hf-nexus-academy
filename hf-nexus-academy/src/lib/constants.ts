export const COUNTRIES = [
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Netherlands",
  "Sweden",
  "Norway",
  "Denmark",
  "Switzerland",
  "United Arab Emirates",
  "Saudi Arabia",
  "Qatar",
  "Kuwait",
  "Oman",
  "Bahrain",
  "Other",
] as const;

export const COURSE_CATEGORY_LABELS: Record<string, string> = {
  QURAN: "Quran",
  HADITH: "Hadith",
  FIQH: "Fiqh",
  ARABIC: "Arabic Language",
  ISLAMIC_FOUNDATIONS: "Islamic Foundations",
  AQEEDAH: "Aqeedah",
  LOGIC: "Logic (Mantiq)",
};

export const COURSE_CATEGORY_SLUGS: Record<string, string> = {
  QURAN: "quran",
  HADITH: "hadith",
  FIQH: "fiqh",
  ARABIC: "arabic",
  ISLAMIC_FOUNDATIONS: "islamic-foundations",
  AQEEDAH: "aqeedah",
  LOGIC: "logic",
};

// Pricing plans are now managed in the database via the PricingPlan model
// and the admin portal (Admin → Pricing Plans), so they can be edited without
// a code change or redeploy. See prisma/seed.ts for the initial seed values
// and src/lib/data/public.ts for getPublishedPricingPlans().

export const CURRENCIES = ["USD", "GBP", "EUR"] as const;
export type Currency = (typeof CURRENCIES)[number];
