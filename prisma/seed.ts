import { PrismaClient, CourseCategory, CourseLevel, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding HF Nexus Academy database...");

  // -----------------------------
  // Admin account
  // -----------------------------
  const adminPasswordHash = await bcrypt.hash("ChangeMe123!", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@hf-nexus.com" },
    update: {},
    create: {
      name: "HF Nexus Admin",
      email: "admin@hf-nexus.com",
      passwordHash: adminPasswordHash,
      role: Role.ADMIN,
      emailVerified: new Date(),
    },
  });
  console.log(`Admin created: ${admin.email} (password: ChangeMe123! — change immediately)`);

  // -----------------------------
  // Teachers
  // -----------------------------
  const teacherSeeds = [
    {
      email: "muhammad.faizan@hf-nexus.com",
      name: "Mufti Muhammad Faizan",
      slug: "mufti-muhammad-faizan",
      title: "Mufti",
      bio: "Mufti Muhammad Faizan specializes in Fiqh, Arabic language, and Aqeedah. He has taught students across the United States, United Kingdom, and the Gulf region, focusing on practical fiqh for daily life and building a strong foundation in core Islamic beliefs.",
      specializations: ["Fiqh", "Arabic Language", "Aqeedah"],
      experienceYears: 12,
    },
    {
      email: "ahsan.ilyas@hf-nexus.com",
      name: "Mufti Ahsan Ilyas",
      slug: "mufti-ahsan-ilyas",
      title: "Mufti",
      bio: "Mufti Ahsan Ilyas specializes in Quran recitation and Tajweed, Arabic language, and Logic (Mantiq). His teaching emphasizes classical methodology paired with accessible explanation for students at every level.",
      specializations: ["Quran & Tajweed", "Arabic Language", "Logic (Mantiq)"],
      experienceYears: 8,
    },
    {
      email: "faizan.tahir@hf-nexus.com",
      name: "Mufti Faizan Tahir",
      slug: "mufti-faizan-tahir",
      title: "Mufti",
      bio: "Mufti Faizan Tahir teaches Quran recitation and Tajweed, Hadith, and Arabic language, guiding students through memorization support, authentic Hadith study, and foundational Arabic together.",
      specializations: ["Quran & Tajweed", "Hadith", "Arabic Language"],
      experienceYears: 8,
    },
  ];

  const teachers: Record<string, string> = {};

  for (const t of teacherSeeds) {
    const passwordHash = await bcrypt.hash("ChangeMe123!", 12);
    const user = await prisma.user.upsert({
      where: { email: t.email },
      update: {},
      create: {
        name: t.name,
        email: t.email,
        passwordHash,
        role: Role.TEACHER,
        emailVerified: new Date(),
      },
    });

    const teacher = await prisma.teacher.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        slug: t.slug,
        title: t.title,
        bio: t.bio,
        specializations: t.specializations,
        experienceYears: t.experienceYears,
        isPublished: true,
      },
    });

    teachers[t.slug] = teacher.id;
    console.log(`Teacher created: ${t.name}`);
  }

  // -----------------------------
  // Courses
  // -----------------------------
  const courseSeeds: {
    slug: string;
    title: string;
    subtitle: string;
    description: string;
    category: CourseCategory;
    level: CourseLevel;
    durationWeeks: number;
    teacherSlug: string;
    priceMonthlyCents?: number;
    priceCurrency?: string;
  }[] = [
    {
      slug: "quran-nazirah",
      title: "Quran Nazirah",
      subtitle: "Learn to read the Quran with correct pronunciation",
      description:
        "A foundational course for students learning to read the Quran from the beginning, covering Arabic letter recognition, joining letters, and basic reading fluency.",
      category: CourseCategory.QURAN,
      level: CourseLevel.BEGINNER,
      durationWeeks: 12,
      teacherSlug: "mufti-ahsan-ilyas",
    },
    {
      slug: "quran-tajweed",
      title: "Quran Tajweed",
      subtitle: "Master the rules of correct Quranic recitation",
      description:
        "Detailed study of Tajweed rules including articulation points, characteristics of letters, and rules of stopping and starting in recitation.",
      category: CourseCategory.QURAN,
      level: CourseLevel.INTERMEDIATE,
      durationWeeks: 16,
      teacherSlug: "mufti-ahsan-ilyas",
    },
    {
      slug: "quran-hifz-support",
      title: "Hifz Support",
      subtitle: "Structured memorization support and revision",
      description:
        "Ongoing memorization support with structured daily targets, revision cycles, and personalized tracking for students memorizing the Quran.",
      category: CourseCategory.QURAN,
      level: CourseLevel.INTERMEDIATE,
      durationWeeks: 52,
      teacherSlug: "mufti-faizan-tahir",
    },
    {
      slug: "quran-tafsir-basics",
      title: "Tafsir Basics",
      subtitle: "An introduction to Quranic exegesis",
      description:
        "An introductory course covering the foundational principles of Tafsir, key commentators, and methodology for understanding Quranic verses in context.",
      category: CourseCategory.QURAN,
      level: CourseLevel.BEGINNER,
      durationWeeks: 10,
      teacherSlug: "mufti-faizan-tahir",
    },
    {
      slug: "hadith-forty-hadith",
      title: "Forty Hadith",
      subtitle: "Study of Imam An-Nawawi's Forty Hadith",
      description:
        "An in-depth study of the classical Forty Hadith collection, covering core principles of belief, worship, and conduct in Islam.",
      category: CourseCategory.HADITH,
      level: CourseLevel.BEGINNER,
      durationWeeks: 10,
      teacherSlug: "mufti-faizan-tahir",
    },
    {
      slug: "hadith-riyadh-us-saliheen",
      title: "Riyadh us Saliheen",
      subtitle: "Gardens of the Righteous",
      description:
        "A comprehensive study of Imam An-Nawawi's Riyadh us Saliheen, covering themes of character, worship, and daily conduct through authentic Hadith.",
      category: CourseCategory.HADITH,
      level: CourseLevel.INTERMEDIATE,
      durationWeeks: 24,
      teacherSlug: "mufti-faizan-tahir",
    },
    {
      slug: "hadith-methodology",
      title: "Hadith Methodology",
      subtitle: "Foundations of Hadith sciences",
      description:
        "An introduction to the science of Hadith authentication, chains of transmission (sanad), and classification methodology used by classical scholars.",
      category: CourseCategory.HADITH,
      level: CourseLevel.ADVANCED,
      durationWeeks: 16,
      teacherSlug: "mufti-faizan-tahir",
    },
    {
      slug: "fiqh-qudoori",
      title: "Qudoori",
      subtitle: "Foundations of Hanafi Fiqh through Mukhtasar al-Quduri",
      description:
        "A beginner-level Fiqh course focused on building strong foundations through careful reading (ibarat), grammatical analysis (aerab), translation (tarjuma), and understanding of the classical Hanafi text Mukhtasar al-Quduri.",
      category: CourseCategory.FIQH,
      level: CourseLevel.BEGINNER,
      durationWeeks: 24,
      priceMonthlyCents: 6900,
      priceCurrency: "USD",
      teacherSlug: "mufti-muhammad-faizan",
    },
    {
      slug: "fiqh-hidayah-jild-1",
      title: "Hidayah — Jild 1",
      subtitle: "Advanced Hanafi Fiqh, Volume 1",
      description:
        "The first volume of Al-Hidayah, the foundational advanced Hanafi Fiqh text. Covers ibarat understanding, key points of ikhtilaf (scholarly difference), and practical application with real-life examples.",
      category: CourseCategory.FIQH,
      level: CourseLevel.ADVANCED,
      durationWeeks: 30,
      priceMonthlyCents: 9900,
      priceCurrency: "USD",
      teacherSlug: "mufti-muhammad-faizan",
    },
    {
      slug: "fiqh-hidayah-jild-2",
      title: "Hidayah — Jild 2",
      subtitle: "Advanced Hanafi Fiqh, Volume 2",
      description:
        "The second volume of Al-Hidayah, continuing the in-depth study of advanced Hanafi Fiqh with detailed ikhtilaf analysis and contemporary application.",
      category: CourseCategory.FIQH,
      level: CourseLevel.ADVANCED,
      durationWeeks: 30,
      priceMonthlyCents: 9900,
      priceCurrency: "USD",
      teacherSlug: "mufti-muhammad-faizan",
    },
    {
      slug: "fiqh-hidayah-jild-3",
      title: "Hidayah — Jild 3",
      subtitle: "Advanced Hanafi Fiqh, Volume 3",
      description:
        "The third volume of Al-Hidayah, deepening study of advanced fiqhi discussions, scholarly differences, and their practical implications.",
      category: CourseCategory.FIQH,
      level: CourseLevel.ADVANCED,
      durationWeeks: 30,
      priceMonthlyCents: 9900,
      priceCurrency: "USD",
      teacherSlug: "mufti-muhammad-faizan",
    },
    {
      slug: "fiqh-hidayah-jild-4",
      title: "Hidayah — Jild 4",
      subtitle: "Advanced Hanafi Fiqh, Volume 4",
      description:
        "The fourth and final volume of Al-Hidayah, completing the advanced Hanafi Fiqh curriculum with comprehensive understanding of content, ikhtilaf, and real-world application.",
      category: CourseCategory.FIQH,
      level: CourseLevel.ADVANCED,
      durationWeeks: 30,
      priceMonthlyCents: 9900,
      priceCurrency: "USD",
      teacherSlug: "mufti-muhammad-faizan",
    },
    {
      slug: "arabic-reading",
      title: "Arabic Reading",
      subtitle: "Foundational Arabic literacy",
      description:
        "A beginner course building Arabic reading fluency, from letter recognition through connected text reading.",
      category: CourseCategory.ARABIC,
      level: CourseLevel.BEGINNER,
      durationWeeks: 10,
      teacherSlug: "mufti-ahsan-ilyas",
    },
    {
      slug: "arabic-grammar",
      title: "Arabic Grammar",
      subtitle: "Nahw and Sarf fundamentals",
      description:
        "Study of Arabic grammar fundamentals including sentence structure, verb conjugation, and morphological patterns.",
      category: CourseCategory.ARABIC,
      level: CourseLevel.INTERMEDIATE,
      durationWeeks: 20,
      teacherSlug: "mufti-muhammad-faizan",
    },
    {
      slug: "arabic-vocabulary",
      title: "Arabic Vocabulary",
      subtitle: "Building functional vocabulary",
      description:
        "A vocabulary-building course organized by everyday themes, designed to expand functional Arabic vocabulary quickly.",
      category: CourseCategory.ARABIC,
      level: CourseLevel.BEGINNER,
      durationWeeks: 8,
      teacherSlug: "mufti-muhammad-faizan",
    },
    {
      slug: "arabic-conversation",
      title: "Arabic Conversation",
      subtitle: "Spoken fluency practice",
      description:
        "A conversation-focused course for students who have completed foundational grammar and vocabulary, emphasizing spoken fluency.",
      category: CourseCategory.ARABIC,
      level: CourseLevel.INTERMEDIATE,
      durationWeeks: 12,
      teacherSlug: "mufti-ahsan-ilyas",
    },
    {
      slug: "logic-introduction",
      title: "Introduction to Logic (Mantiq)",
      subtitle: "Foundations of classical reasoning",
      description:
        "An introductory course to the discipline of Mantiq (Logic) as studied in the classical Islamic curriculum.",
      category: CourseCategory.LOGIC,
      level: CourseLevel.BEGINNER,
      durationWeeks: 8,
      teacherSlug: "mufti-ahsan-ilyas",
    },
    {
      slug: "logic-definitions",
      title: "Logic: Definitions",
      subtitle: "Categories and definitions in classical logic",
      description:
        "A study of definitional structures, categories, and classification as used in classical logical reasoning.",
      category: CourseCategory.LOGIC,
      level: CourseLevel.INTERMEDIATE,
      durationWeeks: 8,
      teacherSlug: "mufti-ahsan-ilyas",
    },
    {
      slug: "logic-reasoning",
      title: "Logic: Reasoning",
      subtitle: "Syllogistic reasoning structures",
      description:
        "Study of syllogistic reasoning patterns and their application within classical Islamic scholarly discourse.",
      category: CourseCategory.LOGIC,
      level: CourseLevel.ADVANCED,
      durationWeeks: 10,
      teacherSlug: "mufti-ahsan-ilyas",
    },
    {
      slug: "logic-classical",
      title: "Classical Logic",
      subtitle: "Advanced Mantiq texts",
      description:
        "An advanced course working through classical Mantiq texts, building on prior study of definitions and reasoning structures.",
      category: CourseCategory.LOGIC,
      level: CourseLevel.ADVANCED,
      durationWeeks: 16,
      teacherSlug: "mufti-ahsan-ilyas",
    },
  ];

  for (const c of courseSeeds) {
    await prisma.course.upsert({
      where: { slug: c.slug },
      update: {},
      create: {
        slug: c.slug,
        title: c.title,
        subtitle: c.subtitle,
        description: c.description,
        category: c.category,
        level: c.level,
        durationWeeks: c.durationWeeks,
        teacherId: teachers[c.teacherSlug],
        isPublished: true,
        priceMonthlyCents: c.priceMonthlyCents,
        priceCurrency: c.priceCurrency,
      },
    });
  }
  console.log(`Seeded ${courseSeeds.length} courses.`);

  // -----------------------------
  // Blog posts
  // -----------------------------
  const blogSeeds = [
    {
      slug: "importance-of-tajweed-in-quran-recitation",
      title: "The Importance of Tajweed in Quran Recitation",
      excerpt:
        "Tajweed is more than pronunciation rules — it preserves the Quran's meaning and beauty as it was revealed. Here's why every student should prioritize it.",
      content:
        "<p>Tajweed refers to the set of rules governing how the Quran should be correctly pronounced during recitation. For many students, it can initially seem like a technical, even tedious, subject — a list of rules about where to lengthen a vowel or how to pronounce a particular letter. But Tajweed serves a far deeper purpose than correctness for its own sake.</p><h2>Preserving Meaning</h2><p>Arabic is a precise language, and small changes in pronunciation can alter the meaning of a word entirely. Tajweed rules exist to ensure that the Quran is recited exactly as it was revealed, protecting its meaning from distortion across generations and languages.</p><h2>Connecting to Tradition</h2><p>Learning Tajweed connects students to an unbroken chain of transmission stretching back to the Prophet Muhammad ﷺ himself. Every rule has been preserved and taught generation after generation, making Tajweed study a direct link to that tradition.</p><h2>Getting Started</h2><p>For beginners, the path to mastering Tajweed starts with learning to read Arabic letters correctly, then gradually layering on rules of elongation, nasalization, and stopping. Consistent practice with a qualified teacher remains the most effective way to internalize these rules.</p>",
      category: "QURAN" as const,
      authorName: "Mufti Muhammad Faizan",
    },
    {
      slug: "understanding-the-sanad-chain-of-transmission",
      title: "Understanding the Sanad: How Hadith Knowledge Was Preserved",
      excerpt:
        "The sanad — chain of transmission — is one of the most remarkable features of Islamic scholarship. Here's how it works and why it matters.",
      content:
        "<p>One of the most distinctive features of Islamic scholarship is the sanad, or chain of transmission, used to verify the authenticity of Hadith. Each Hadith is traced back through a named sequence of narrators, generation by generation, to the Prophet Muhammad ﷺ.</p><h2>Why the Sanad Matters</h2><p>Before a Hadith is accepted as authentic, scholars examine every name in its chain — assessing each narrator's reliability, memory, and character. This rigorous methodology allowed early scholars to distinguish authentic narrations from fabricated or weak ones, even centuries after the fact.</p><h2>A Living Tradition</h2><p>The concept of sanad extends beyond Hadith — it is also used in transmitting Quranic recitation, Islamic law, and scholarly authorization more broadly. Students studying at academies like ours are, in a small way, continuing this same tradition of structured, verified transmission of knowledge.</p>",
      category: "HADITH" as const,
      authorName: "Mufti Ahsan Ilyas",
    },
    {
      slug: "why-learning-arabic-deepens-your-connection-to-the-quran",
      title: "Why Learning Arabic Deepens Your Connection to the Quran",
      excerpt:
        "Translations open a door to understanding, but learning Arabic lets you walk through it. Here's how Arabic study transforms how you experience the Quran.",
      content:
        "<p>Many Muslims first encounter the Quran through translation, and while translations are valuable, they inevitably involve interpretive choices that can never fully capture the original Arabic's depth, rhythm, and layered meaning.</p><h2>Words With Multiple Layers</h2><p>Arabic words often carry several related meanings simultaneously, and classical commentators frequently draw on this richness when explaining a verse. A single English word in translation usually can't carry the same range.</p><h2>Building Fluency Gradually</h2><p>Arabic study doesn't need to start with grammar textbooks. Many students begin with reading fluency, move to core vocabulary, and only later study grammar in depth — building genuine comprehension step by step rather than all at once.</p><h2>A Worthwhile Investment</h2><p>Even a modest level of Arabic proficiency can transform how a student reads and reflects on the Quran, making study an active, personal engagement rather than a passive reading of someone else's interpretation.</p>",
      category: "ARABIC" as const,
      authorName: "Mufti Ahsan Ilyas",
    },
  ];

  for (const post of blogSeeds) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        category: post.category,
        authorName: post.authorName,
        status: "PUBLISHED",
        publishedAt: new Date(),
      },
    });
  }
  console.log(`Seeded ${blogSeeds.length} blog posts.`);

  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
