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

export type PricingPlan = {
  id: "STARTER" | "STANDARD" | "PREMIUM";
  name: string;
  description: string;
  priceMonthlyCents: { USD: number; GBP: number; EUR: number };
  features: string[];
  highlighted?: boolean;
};

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "STARTER",
    name: "Starter",
    description: "For students beginning their Islamic learning journey.",
    priceMonthlyCents: { USD: 5900, GBP: 4700, EUR: 5400 },
    features: [
      "1 live class per week",
      "Access to one course track",
      "Recorded class library",
      "Email support",
    ],
  },
  {
    id: "STANDARD",
    name: "Standard",
    description: "Our most popular plan for consistent, structured learning.",
    priceMonthlyCents: { USD: 9900, GBP: 7800, EUR: 9100 },
    features: [
      "2 live classes per week",
      "Access to up to 3 course tracks",
      "Assignment feedback",
      "Progress tracking & certificates",
      "Priority WhatsApp support",
    ],
    highlighted: true,
  },
  {
    id: "PREMIUM",
    name: "Premium",
    description: "Full access for serious, accelerated study.",
    priceMonthlyCents: { USD: 17900, GBP: 14100, EUR: 16500 },
    features: [
      "Unlimited live classes",
      "Full access to all course tracks",
      "1-on-1 mentorship sessions",
      "Hifz support included",
      "Certificates of completion",
      "Dedicated academic advisor",
    ],
  },
];

export const CURRENCIES = ["USD", "GBP", "EUR"] as const;
export type Currency = (typeof CURRENCIES)[number];

export function getPlanPriceCents(planId: string, currency: Currency): number {
  const plan = PRICING_PLANS.find((p) => p.id === planId);
  if (!plan) {
    throw new Error(`Unknown plan: ${planId}`);
  }
  return plan.priceMonthlyCents[currency];
}

export function getStripePriceId(planId: string): string | undefined {
  const map: Record<string, string | undefined> = {
    STARTER: process.env.STRIPE_PRICE_STARTER_MONTHLY,
    STANDARD: process.env.STRIPE_PRICE_STANDARD_MONTHLY,
    PREMIUM: process.env.STRIPE_PRICE_PREMIUM_MONTHLY,
  };
  return map[planId];
}
