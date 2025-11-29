"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FeatureList, FeaturePills } from "./feature-list";
import { StatsCounter } from "./stats-counter";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const badgeVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: -10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.34, 1.56, 0.64, 1],
    },
  },
};

export function AboutContent() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="lg:pl-8"
    >
      {/* Section Badge */}
      <motion.div variants={badgeVariants}>
        <span className="inline-flex items-center gap-2 bg-primary/10 dark:bg-primary/20 backdrop-blur-sm px-4 py-2 rounded-full border border-primary/20 dark:border-primary/30">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          <span className="text-sm font-semibold text-primary">
            About Us
          </span>
        </span>
      </motion.div>

      {/* Main Headline */}
      <motion.h2
        variants={itemVariants}
        id="about-heading"
        className="mt-5 sm:mt-6 text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-[1.15] tracking-tight"
      >
        Crafting Pizza with{" "}
        <motion.span
          className="relative inline-block"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <span className="relative z-10 text-primary">Passion</span>
          <motion.svg
            className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-2 sm:h-3 text-primary/30"
            viewBox="0 0 200 12"
            preserveAspectRatio="none"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          >
            <motion.path
              d="M0 8 Q 50 0, 100 8 T 200 8"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
          </motion.svg>
        </motion.span>{" "}
        Since 2020
      </motion.h2>

      {/* Story Paragraph */}
      <motion.p
        variants={itemVariants}
        className="mt-5 sm:mt-6 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl"
      >
        What started as a dream in a small kitchen has grown into a beloved neighborhood destination.
        At Pizza Space, we believe every pizza tells a story - handcrafted with love, topped with
        the freshest ingredients, and baked to perfection in our authentic wood-fired ovens.
      </motion.p>

      {/* Secondary paragraph */}
      <motion.p
        variants={itemVariants}
        className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl"
      >
        Our commitment to quality has earned us recognition across the city, but it&apos;s the
        smiles on our customers&apos; faces that truly drive us forward every day.
      </motion.p>

      {/* Feature Pills */}
      <motion.div variants={itemVariants} className="mt-6 sm:mt-8">
        <FeaturePills />
      </motion.div>

      {/* Feature List */}
      <motion.div variants={itemVariants} className="mt-8 sm:mt-10">
        <FeatureList />
      </motion.div>

      {/* CTA Button */}
      <motion.div variants={itemVariants} className="mt-8 sm:mt-10">
        <Link href="/about">
          <Button
            size="lg"
            className="group relative overflow-hidden shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
          >
            {/* Button gradient overlay on hover */}
            <span className="absolute inset-0 bg-gradient-to-r from-orange-600 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative flex items-center gap-2">
              Our Story
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </Button>
        </Link>
      </motion.div>

      {/* Stats Section */}
      <motion.div variants={itemVariants} className="mt-10 sm:mt-12">
        <StatsCounter />
      </motion.div>
    </motion.div>
  );
}
