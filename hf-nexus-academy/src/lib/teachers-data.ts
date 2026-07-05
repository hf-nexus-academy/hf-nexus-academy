import type { TeacherCardData } from "@/components/shared/teacher-card";

export interface TeacherDetailData extends TeacherCardData {
  longBio: string;
  coursesTaught: { slug: string; title: string; category: string }[];
}

export const TEACHERS: TeacherDetailData[] = [
  {
    slug: "mufti-muhammad-faizan",
    name: "Mufti Muhammad Faizan",
    title: "Mufti",
    bio: "Mufti Muhammad Faizan specializes in Fiqh, Arabic language, and Aqeedah. He has taught students across the United States, United Kingdom, and the Gulf region, focusing on practical fiqh for daily life and building a strong foundation in core Islamic beliefs.",
    longBio:
      "Mufti Muhammad Faizan completed the traditional Dars-e-Nizami curriculum with a specialization in Fiqh (Islamic jurisprudence), Arabic language, and Aqeedah (Islamic creed). With over a decade of teaching experience, he has worked with students across the United States, United Kingdom, and the Gulf region, with a particular focus on making Fiqh practical and applicable to daily life. His Arabic classes build genuine reading and comprehension skills from the ground up, while his Aqeedah teaching focuses on building clarity and confidence in core Islamic beliefs. His teaching style emphasizes clear explanation of classical rulings alongside their real-world application, helping students not just memorize rules but understand the reasoning behind them.",
    specializations: ["Fiqh", "Arabic Language", "Aqeedah"],
    experienceYears: 12,
    coursesTaught: [
      { slug: "fiqh-purification", title: "Fiqh of Purification", category: "fiqh" },
      { slug: "fiqh-prayer", title: "Fiqh of Prayer", category: "fiqh" },
      { slug: "fiqh-fasting", title: "Fiqh of Fasting", category: "fiqh" },
      { slug: "fiqh-zakat", title: "Fiqh of Zakat", category: "fiqh" },
      { slug: "fiqh-transactions", title: "Fiqh of Transactions", category: "fiqh" },
      { slug: "arabic-grammar", title: "Arabic Grammar", category: "arabic" },
      { slug: "arabic-vocabulary", title: "Arabic Vocabulary", category: "arabic" },
    ],
  },
  {
    slug: "mufti-ahsan-ilyas",
    name: "Mufti Ahsan Ilyas",
    title: "Mufti",
    bio: "Mufti Ahsan Ilyas specializes in Quran recitation and Tajweed, Arabic language, and Logic (Mantiq). His teaching emphasizes classical methodology paired with accessible explanation for students at every level.",
    longBio:
      "Mufti Ahsan Ilyas specializes in Quran recitation and Tajweed, Arabic language instruction, and Logic (Mantiq). His training includes detailed study of the rules of Quranic recitation alongside classical Arabic grammar and the discipline of Mantiq as taught in the traditional curriculum. Having taught a wide range of students, he has developed a teaching approach that bridges traditional methodology with accessible, structured explanation — helping students build genuine comprehension rather than rote memorization. His Tajweed classes are known for patient, detail-oriented correction, while his Logic classes train students in disciplined, structured reasoning.",
    specializations: ["Quran & Tajweed", "Arabic Language", "Logic (Mantiq)"],
    experienceYears: 8,
    coursesTaught: [
      { slug: "quran-nazirah", title: "Quran Nazirah", category: "quran" },
      { slug: "quran-tajweed", title: "Quran Tajweed", category: "quran" },
      { slug: "arabic-reading", title: "Arabic Reading", category: "arabic" },
      { slug: "arabic-conversation", title: "Arabic Conversation", category: "arabic" },
      { slug: "logic-introduction", title: "Introduction to Logic (Mantiq)", category: "logic" },
      { slug: "logic-definitions", title: "Logic: Definitions", category: "logic" },
      { slug: "logic-reasoning", title: "Logic: Reasoning", category: "logic" },
      { slug: "logic-classical", title: "Classical Logic", category: "logic" },
    ],
  },
  {
    slug: "mufti-faizan-tahir",
    name: "Mufti Faizan Tahir",
    title: "Mufti",
    bio: "Mufti Faizan Tahir teaches Quran recitation and Tajweed, Hadith, and Arabic language, guiding students through memorization support, authentic Hadith study, and foundational Arabic together.",
    longBio:
      "Mufti Faizan Tahir teaches Quran recitation and Tajweed, the sciences of Hadith, and Arabic language. His training includes Hifz memorization methodology and the study of authentic Hadith collections, alongside a strong grounding in Quranic recitation. Students benefit from his structured approach to memorization support and his ability to connect Hadith narrations to their broader context and practical relevance in daily life. His Arabic teaching rounds out a well-balanced foundation for students progressing through multiple disciplines at once.",
    specializations: ["Quran & Tajweed", "Hadith", "Arabic Language"],
    experienceYears: 8,
    coursesTaught: [
      { slug: "quran-hifz-support", title: "Hifz Support", category: "quran" },
      { slug: "quran-tafsir-basics", title: "Tafsir Basics", category: "quran" },
      { slug: "hadith-forty-hadith", title: "Forty Hadith", category: "hadith" },
      { slug: "hadith-riyadh-us-saliheen", title: "Riyadh us Saliheen", category: "hadith" },
      { slug: "hadith-methodology", title: "Hadith Methodology", category: "hadith" },
    ],
  },
];
