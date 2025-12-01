"use client";

import { motion } from "framer-motion";
import { Target, Eye, Sparkles } from "lucide-react";
import { MissionCard } from "./mission-card";

// Background decorative elements
function BackgroundDecorations() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Primary gradient orb - top right */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-gradient-to-br from-orange-500/20 via-orange-400/10 to-transparent dark:from-orange-500/10 dark:via-orange-400/5 dark:to-transparent rounded-full blur-3xl"
      />

      {/* Secondary gradient orb - bottom left */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
        className="absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-gradient-to-tr from-primary/15 via-amber-400/10 to-transparent dark:from-primary/10 dark:via-amber-400/5 dark:to-transparent rounded-full blur-3xl"
      />

      {/* Accent orb - center */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, delay: 0.4 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-radial from-orange-100/30 via-transparent to-transparent dark:from-orange-500/5 dark:via-transparent dark:to-transparent rounded-full blur-3xl"
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f97316' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Floating decorative elements */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="absolute top-20 left-[15%] hidden lg:block"
      >
        <motion.div
          animate={{ y: [0, -12, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-3 h-3 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 shadow-lg shadow-orange-500/30 dark:shadow-orange-500/20" />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="absolute bottom-32 right-[20%] hidden lg:block"
      >
        <motion.div
          animate={{ y: [0, -8, 0], rotate: [0, -3, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <div className="w-2 h-2 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 shadow-lg shadow-amber-500/30 dark:shadow-amber-500/20" />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 1 }}
        className="absolute top-1/3 right-[10%] hidden xl:block"
      >
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          <Sparkles className="w-6 h-6 text-orange-400/40 dark:text-orange-400/20" />
        </motion.div>
      </motion.div>
    </div>
  );
}

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
      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-4"
      >
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20">
          <Target className="w-3.5 h-3.5" />
          Why We Do It
        </span>
      </motion.div>

      {/* Headline */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4"
      >
        Our{" "}
        <span className="text-orange-500 relative">
          Purpose
          {/* Decorative underline */}
          <svg
            className="absolute -bottom-2 left-0 w-full h-3 text-orange-300 dark:text-orange-500/50"
            viewBox="0 0 100 12"
            preserveAspectRatio="none"
          >
            <path
              d="M0 8 Q 25 0, 50 8 T 100 8"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </span>{" "}
        & Direction
      </motion.h2>

      {/* Subheadline */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-slate-600 dark:text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
      >
        Driven by passion, guided by values. Discover what fuels our commitment
        to crafting exceptional pizza experiences for our community.
      </motion.p>

      {/* Decorative elements */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex items-center justify-center gap-3 mt-6"
      >
        <span className="w-12 h-0.5 bg-gradient-to-r from-transparent to-orange-300 dark:to-orange-500/50 rounded-full" />
        <span className="w-2 h-2 bg-orange-400 dark:bg-orange-500 rounded-full" />
        <span className="w-12 h-0.5 bg-gradient-to-l from-transparent to-orange-300 dark:to-orange-500/50 rounded-full" />
      </motion.div>
    </motion.div>
  );
}

export function MissionVisionSection() {
  return (
    <section
      className="relative py-16 md:py-24 lg:py-32 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-navy-900 dark:via-navy-900 dark:to-navy-950"
      aria-labelledby="mission-vision-heading"
    >
      {/* Background decorations */}
      <BackgroundDecorations />

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <SectionHeader />

        {/* Cards grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-10 max-w-5xl mx-auto">
          <MissionCard
            icon={Target}
            title="Our Mission"
            description="To bring authentic Italian flavors to every table, creating memorable dining experiences through exceptional food, warm hospitality, and community connection. We strive to be the heart of our neighborhood's culinary landscape."
            iconGradient="from-orange-500 to-red-500"
            delay={0}
          />
          <MissionCard
            icon={Eye}
            title="Our Vision"
            description="To become the most beloved pizza destination, known for our unwavering commitment to quality, innovation in traditional recipes, and creating a welcoming space where families and friends gather to share great food and create lasting memories."
            iconGradient="from-amber-500 to-orange-500"
            delay={0.15}
          />
        </div>

        {/* Bottom decorative element */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 md:mt-20 lg:mt-24 h-px bg-gradient-to-r from-transparent via-orange-300 dark:via-orange-700/50 to-transparent max-w-2xl mx-auto"
        />
      </div>
    </section>
  );
}
