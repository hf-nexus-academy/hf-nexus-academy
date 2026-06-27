import type { CourseCardData } from "@/components/shared/course-card";

export const COURSES_BY_CATEGORY: Record<string, CourseCardData[]> = {
  quran: [
    {
      slug: "quran-nazirah",
      title: "Quran Nazirah",
      subtitle: "Learn to read the Quran with correct pronunciation, from letter recognition to fluent reading.",
      level: "BEGINNER",
      durationWeeks: 12,
    },
    {
      slug: "quran-tajweed",
      title: "Quran Tajweed",
      subtitle: "Master the rules of correct Quranic recitation, articulation points, and stopping rules.",
      level: "INTERMEDIATE",
      durationWeeks: 16,
    },
    {
      slug: "quran-hifz-support",
      title: "Hifz Support",
      subtitle: "Structured memorization support with daily targets and revision cycles.",
      level: "INTERMEDIATE",
      durationWeeks: 52,
    },
    {
      slug: "quran-tafsir-basics",
      title: "Tafsir Basics",
      subtitle: "An introduction to Quranic exegesis, key commentators, and interpretive methodology.",
      level: "BEGINNER",
      durationWeeks: 10,
    },
  ],
  hadith: [
    {
      slug: "hadith-forty-hadith",
      title: "Forty Hadith",
      subtitle: "Study of Imam An-Nawawi's Forty Hadith, covering core principles of belief and conduct.",
      level: "BEGINNER",
      durationWeeks: 10,
    },
    {
      slug: "hadith-riyadh-us-saliheen",
      title: "Riyadh us Saliheen",
      subtitle: "A comprehensive study of the Gardens of the Righteous through authentic Hadith.",
      level: "INTERMEDIATE",
      durationWeeks: 24,
    },
    {
      slug: "hadith-methodology",
      title: "Hadith Methodology",
      subtitle: "An introduction to Hadith authentication, chains of transmission, and classification.",
      level: "ADVANCED",
      durationWeeks: 16,
    },
  ],
  fiqh: [
    {
      slug: "fiqh-qudoori",
      title: "Qudoori",
      subtitle:
        "A beginner-level Fiqh course focused on building strong foundations through careful reading (ibarat), grammatical analysis (aerab), translation (tarjuma), and understanding of the classical Hanafi text Mukhtasar al-Quduri.",
      level: "BEGINNER",
      durationWeeks: 24,
      priceMonthlyUSD: 69,
    },
    {
      slug: "fiqh-hidayah-jild-1",
      title: "Hidayah — Jild 1",
      subtitle:
        "The first volume of Al-Hidayah, the foundational advanced Hanafi Fiqh text. Covers ibarat understanding, key points of ikhtilaf (scholarly difference), and practical application with real-life examples.",
      level: "ADVANCED",
      durationWeeks: 30,
      priceMonthlyUSD: 99,
    },
    {
      slug: "fiqh-hidayah-jild-2",
      title: "Hidayah — Jild 2",
      subtitle:
        "The second volume of Al-Hidayah, continuing the in-depth study of advanced Hanafi Fiqh with detailed ikhtilaf analysis and contemporary application.",
      level: "ADVANCED",
      durationWeeks: 30,
      priceMonthlyUSD: 99,
    },
    {
      slug: "fiqh-hidayah-jild-3",
      title: "Hidayah — Jild 3",
      subtitle:
        "The third volume of Al-Hidayah, deepening study of advanced fiqhi discussions, scholarly differences, and their practical implications.",
      level: "ADVANCED",
      durationWeeks: 30,
      priceMonthlyUSD: 99,
    },
    {
      slug: "fiqh-hidayah-jild-4",
      title: "Hidayah — Jild 4",
      subtitle:
        "The fourth and final volume of Al-Hidayah, completing the advanced Hanafi Fiqh curriculum with comprehensive understanding of content, ikhtilaf, and real-world application.",
      level: "ADVANCED",
      durationWeeks: 30,
      priceMonthlyUSD: 99,
    },
  ],
  arabic: [
    {
      slug: "arabic-reading",
      title: "Arabic Reading",
      subtitle: "Foundational Arabic literacy from letter recognition through connected text reading.",
      level: "BEGINNER",
      durationWeeks: 10,
    },
    {
      slug: "arabic-grammar",
      title: "Arabic Grammar",
      subtitle: "Nahw and Sarf fundamentals: sentence structure, verb conjugation, and morphology.",
      level: "INTERMEDIATE",
      durationWeeks: 20,
    },
    {
      slug: "arabic-vocabulary",
      title: "Arabic Vocabulary",
      subtitle: "A theme-based vocabulary course designed to expand functional Arabic quickly.",
      level: "BEGINNER",
      durationWeeks: 8,
    },
    {
      slug: "arabic-conversation",
      title: "Arabic Conversation",
      subtitle: "Spoken fluency practice for students who've completed foundational study.",
      level: "INTERMEDIATE",
      durationWeeks: 12,
    },
  ],
  logic: [
    {
      slug: "logic-introduction",
      title: "Introduction to Logic (Mantiq)",
      subtitle: "Foundations of the discipline of Mantiq as studied in the classical curriculum.",
      level: "BEGINNER",
      durationWeeks: 8,
    },
    {
      slug: "logic-definitions",
      title: "Logic: Definitions",
      subtitle: "Categories and definitional structures in classical logical reasoning.",
      level: "INTERMEDIATE",
      durationWeeks: 8,
    },
    {
      slug: "logic-reasoning",
      title: "Logic: Reasoning",
      subtitle: "Syllogistic reasoning patterns and their application in scholarly discourse.",
      level: "ADVANCED",
      durationWeeks: 10,
    },
    {
      slug: "logic-classical",
      title: "Classical Logic",
      subtitle: "An advanced course working through classical Mantiq texts.",
      level: "ADVANCED",
      durationWeeks: 16,
    },
  ],
};

export const CATEGORY_META: Record<
  string,
  { title: string; description: string; teacherSlug: string }
> = {
  quran: {
    title: "Quran Courses",
    description:
      "From first letters to Tajweed mastery and memorization support — structured Quran education for every level.",
    teacherSlug: "mufti-ahsan-ilyas",
  },
  hadith: {
    title: "Hadith Courses",
    description:
      "Study authentic Hadith collections and the classical methodology behind their transmission and verification.",
    teacherSlug: "mufti-faizan-tahir",
  },
  fiqh: {
    title: "Fiqh Courses",
    description:
      "Traditional Hanafi Fiqh taught through classical texts — Qudoori for beginners, and the four volumes of Hidayah for advanced students.",
    teacherSlug: "mufti-muhammad-faizan",
  },
  arabic: {
    title: "Arabic Language Courses",
    description:
      "Build real Arabic fluency — reading, grammar, vocabulary, and conversation — taught from the ground up.",
    teacherSlug: "mufti-muhammad-faizan",
  },
  logic: {
    title: "Logic (Mantiq) Courses",
    description:
      "Classical Islamic logic and reasoning frameworks, from foundational definitions to advanced texts.",
    teacherSlug: "mufti-ahsan-ilyas",
  },
};
