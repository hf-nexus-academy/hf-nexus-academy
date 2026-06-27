"use client";

import { motion } from "framer-motion";
import {
  GraduationCap,
  BookOpenCheck,
  Video,
  Clock,
  UserCheck,
  Globe2,
  Users,
  LayoutList,
} from "lucide-react";

const REASONS = [
  {
    icon: GraduationCap,
    title: "Qualified Scholars",
    description: "Every class is taught by scholars trained in classical Islamic curricula.",
  },
  {
    icon: BookOpenCheck,
    title: "Authentic Curriculum",
    description: "Structured courses rooted in established texts and traditional methodology.",
  },
  {
    icon: Video,
    title: "Live Interactive Classes",
    description: "Real-time sessions with direct interaction, not pre-recorded lectures.",
  },
  {
    icon: Clock,
    title: "Flexible Timings",
    description: "Class schedules built around your timezone, wherever you are.",
  },
  {
    icon: UserCheck,
    title: "Personalized Learning",
    description: "Pacing and feedback tailored to each student's level and goals.",
  },
  {
    icon: Globe2,
    title: "Worldwide Access",
    description: "Serving students across 17+ countries from a single online platform.",
  },
  {
    icon: Users,
    title: "Small Group Learning",
    description: "Focused class sizes that keep every student engaged and accountable.",
  },
  {
    icon: LayoutList,
    title: "Structured Islamic Education",
    description: "A clear progression from foundations through advanced study.",
  },
];

export function WhyHfNexus() {
  return (
    <section className="bg-cream-50 py-20 lg:py-28">
      <div className="container">
        <div className="max-w-2xl mb-14">
          <span className="text-xs uppercase tracking-[0.2em] text-gold-600 font-medium">
            Why HF Nexus Academy
          </span>
          <h2 className="font-display text-3xl lg:text-4xl text-navy-950 mt-3 text-balance">
            A learning experience built on tradition, delivered with precision
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {REASONS.map((reason, i) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="group rounded-lg border border-ink-300/15 bg-white p-6 hover:border-gold-500/40 hover:shadow-md transition-all"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-md bg-navy-950 text-gold-400 mb-5 group-hover:bg-gold-500 group-hover:text-navy-950 transition-colors">
                <reason.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-base text-navy-950 mb-1.5">{reason.title}</h3>
              <p className="text-sm text-ink-500 leading-relaxed">{reason.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
