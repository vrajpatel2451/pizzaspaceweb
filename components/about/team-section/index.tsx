"use client";

import { motion } from "framer-motion";
import { TeamCard } from "./team-card";

// Team member data
const teamMembers = [
  {
    name: "Marco Rossi",
    role: "Founder & Head Chef",
    bio: "With 30 years of culinary experience in Italy and a passion for authentic flavors, Marco brings traditional recipes to life in every pizza.",
    image: "/images/team-marco.jpg",
  },
  {
    name: "Sofia Martinez",
    role: "Executive Chef",
    bio: "A master of dough crafting and innovative toppings, Sofia ensures every pizza meets our exacting standards for quality and taste.",
    image: "/images/team-sofia.jpg",
  },
  {
    name: "James Chen",
    role: "Operations Director",
    bio: "Leading our expansion and ensuring consistent excellence across all locations, James brings strategic vision and operational expertise.",
    image: "/images/team-james.jpg",
  },
  {
    name: "Emma Thompson",
    role: "Customer Experience Manager",
    bio: "Dedicated to creating memorable dining experiences, Emma leads our service team with warmth, professionalism, and attention to detail.",
    image: "/images/team-emma.jpg",
  },
];

// Section header component
function SectionHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="text-center mb-12 md:mb-16 lg:mb-20"
    >
      {/* Overline */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="inline-flex items-center gap-2 mb-4"
      >
        <span className="h-px w-8 bg-gradient-to-r from-transparent to-orange-500 dark:to-orange-400" aria-hidden="true" />
        <span className="text-sm font-semibold text-orange-600 dark:text-orange-400 tracking-widest uppercase">
          Meet Our Team
        </span>
        <span className="h-px w-8 bg-gradient-to-l from-transparent to-orange-500 dark:to-orange-400" aria-hidden="true" />
      </motion.div>

      {/* Main heading */}
      <motion.h2
        id="team-heading"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4 md:mb-6"
      >
        The{" "}
        <span className="bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-400 dark:to-orange-500 bg-clip-text text-transparent">
          People
        </span>{" "}
        Behind the Pizza
      </motion.h2>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-slate-600 dark:text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
      >
        Our dedicated team of culinary experts and hospitality professionals work together
        to create exceptional experiences for every guest.
      </motion.p>
    </motion.div>
  );
}

// Background decorations
function BackgroundDecorations() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Gradient orbs */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="absolute -top-32 -right-32 w-96 h-96 bg-gradient-to-br from-orange-500/10 to-orange-600/5 dark:from-orange-500/5 dark:to-orange-600/3 rounded-full blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
        className="absolute -bottom-32 -left-32 w-80 h-80 bg-gradient-to-tr from-amber-500/10 to-amber-600/5 dark:from-amber-500/5 dark:to-amber-600/3 rounded-full blur-3xl"
      />
    </div>
  );
}

export function TeamSection() {
  return (
    <section
      className="relative bg-white dark:bg-navy-900 py-16 md:py-24 lg:py-32 overflow-hidden"
      aria-labelledby="team-heading"
    >
      {/* Background decorations */}
      <BackgroundDecorations />

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <SectionHeader />

        {/* Team grid - 1 col mobile, 2 tablet, 3-4 desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 max-w-7xl mx-auto">
          {teamMembers.map((member, index) => (
            <TeamCard
              key={member.name}
              member={member}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>

      {/* Bottom decorative line */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="relative z-10 mt-16 md:mt-20 lg:mt-24 h-px bg-gradient-to-r from-transparent via-orange-300 dark:via-orange-700/50 to-transparent max-w-2xl mx-auto"
      />
    </section>
  );
}
