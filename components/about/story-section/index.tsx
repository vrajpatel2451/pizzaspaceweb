"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CustomImage } from "@/components/ui/custom-image";
import { Calendar, Award, Users, TrendingUp } from "lucide-react";

// Timeline milestone data
const milestones = [
  {
    year: "1998",
    title: "The Beginning",
    description: "Founded our first location with a dream and a family recipe",
    icon: Calendar,
  },
  {
    year: "2005",
    title: "Award Winning",
    description: "Recognized as Best Pizza in the region",
    icon: Award,
  },
  {
    year: "2012",
    title: "Community Growth",
    description: "Expanded to 10 locations across the country",
    icon: Users,
  },
  {
    year: "2024",
    title: "Innovation",
    description: "Launched online ordering and delivery platform",
    icon: TrendingUp,
  },
];

// Floating ingredient decorations
function FloatingIngredients() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating basil leaf - top right */}
      <motion.div
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20, rotate: shouldReduceMotion ? 0 : 10 }}
        whileInView={{ opacity: 1, y: 0, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.8, delay: shouldReduceMotion ? 0 : 0.6 }}
        className="absolute top-20 right-[10%] hidden lg:block"
      >
        <motion.div
          animate={shouldReduceMotion ? {} : { y: [0, -8, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-10 h-14 bg-gradient-to-t from-green-600 to-green-400 rounded-full rotate-45 shadow-lg shadow-green-200/50 dark:shadow-green-900/30" />
        </motion.div>
      </motion.div>

      {/* Floating tomato - bottom left */}
      <motion.div
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20, rotate: shouldReduceMotion ? 0 : -10 }}
        whileInView={{ opacity: 1, y: 0, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.8, delay: shouldReduceMotion ? 0 : 0.8 }}
        className="absolute bottom-32 left-[8%] hidden lg:block"
      >
        <motion.div
          animate={shouldReduceMotion ? {} : { y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-400 to-red-600 shadow-lg shadow-red-200/50 dark:shadow-red-900/30">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-4 h-2.5 bg-green-500 rounded-full" />
          </div>
        </motion.div>
      </motion.div>

      {/* Floating cheese - mid right */}
      <motion.div
        initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.8, delay: shouldReduceMotion ? 0 : 1 }}
        className="absolute top-1/2 right-[5%] hidden xl:block"
      >
        <motion.div
          animate={shouldReduceMotion ? {} : { y: [0, -12, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <div
            className="w-12 h-12 bg-gradient-to-br from-yellow-300 to-amber-400 rounded-sm rotate-12 shadow-lg shadow-yellow-200/50 dark:shadow-yellow-900/30"
            style={{ clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)" }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

// Timeline component
function Timeline() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="relative">
      {/* Vertical line */}
      <motion.div
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: shouldReduceMotion ? 0 : 1, ease: "easeOut" }}
        className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-200 via-orange-300 to-orange-200 dark:from-orange-800 dark:via-orange-700 dark:to-orange-800 origin-top"
      />

      {/* Milestones */}
      <div className="space-y-8 md:space-y-12">
        {milestones.map((milestone, index) => {
          const Icon = milestone.icon;
          return (
            <motion.div
              key={milestone.year}
              initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.6, delay: shouldReduceMotion ? 0 : index * 0.15 }}
              className="relative flex items-start gap-6 group"
            >
              {/* Icon container */}
              <div className="relative z-10 flex-shrink-0">
                <motion.div
                  initial={{ scale: shouldReduceMotion ? 1 : 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: shouldReduceMotion ? 0 : 0.4,
                    delay: shouldReduceMotion ? 0 : index * 0.15 + 0.2,
                    type: "spring",
                    stiffness: 260,
                    damping: 20
                  }}
                  whileHover={shouldReduceMotion ? {} : { scale: 1.1, rotate: 5 }}
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700 flex items-center justify-center shadow-lg shadow-orange-500/30 dark:shadow-orange-900/30 transition-shadow duration-300 group-hover:shadow-xl group-hover:shadow-orange-500/40"
                >
                  <Icon className="w-7 h-7 text-white" />
                </motion.div>
              </div>

              {/* Content */}
              <div className="flex-1 pt-2">
                <motion.div
                  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.5, delay: shouldReduceMotion ? 0 : index * 0.15 + 0.3 }}
                  className="bg-white/50 dark:bg-navy-800/50 backdrop-blur-sm rounded-xl p-4 border border-transparent group-hover:border-orange-200 dark:group-hover:border-orange-800/50 transition-all duration-300"
                >
                  <motion.div
                    className="inline-block px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 mb-3"
                    whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <span className="text-sm font-bold text-orange-600 dark:text-orange-400">
                      {milestone.year}
                    </span>
                  </motion.div>
                  <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    {milestone.title}
                  </h3>
                  <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                    {milestone.description}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export function StorySection() {
  return (
    <section
      className="relative bg-white dark:bg-navy-900 py-16 md:py-24 lg:py-32 overflow-hidden"
      aria-labelledby="story-heading"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient blobs */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute -top-32 -left-32 w-96 h-96 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="absolute -bottom-32 -right-32 w-80 h-80 bg-orange-100/50 dark:bg-primary/5 rounded-full blur-3xl"
        />
      </div>

      <FloatingIngredients />

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16 lg:mb-20"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 mb-4"
          >
            <span className="h-px w-8 bg-gradient-to-r from-transparent to-orange-500 dark:to-orange-400" aria-hidden="true" />
            <span className="text-sm font-semibold text-orange-600 dark:text-orange-400 tracking-widest uppercase">
              Our Journey
            </span>
            <span className="h-px w-8 bg-gradient-to-l from-transparent to-orange-500 dark:to-orange-400" aria-hidden="true" />
          </motion.div>

          <h2
            id="story-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4 md:mb-6"
          >
            A Legacy of{" "}
            <span className="bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-400 dark:to-orange-500 bg-clip-text text-transparent">
              Passion
            </span>
          </h2>

          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            From humble beginnings to becoming a beloved community staple, our story is
            one of dedication, family traditions, and an unwavering commitment to quality.
          </p>
        </motion.div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-16 xl:gap-20 items-center max-w-6xl mx-auto">
          {/* Left side - Image (on top for mobile) */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="relative lg:order-first"
          >
            <div className="relative aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
              <CustomImage
                src="/images/about-story.jpg"
                alt="Pizza Space restaurant interior with family dining"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                loading="lazy"
              />
              {/* Image overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            {/* Decorative accent */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl sm:rounded-3xl -z-10 blur-2xl opacity-40"
            />
          </motion.div>

          {/* Right side - Content and Timeline */}
          <div className="lg:order-last">
            {/* Story text */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-8 sm:mb-10 md:mb-12"
            >
              <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed mb-3 sm:mb-4">
                Pizza Space was born from a simple vision: to bring authentic Italian
                flavors to our community using time-honored recipes passed down through
                generations. What started as a small family kitchen has grown into a
                beloved destination for pizza lovers.
              </p>
              <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed">
                Every pizza we create honors our heritage while embracing innovation,
                ensuring that each bite delivers the perfect balance of tradition and
                taste.
              </p>
            </motion.div>

            {/* Timeline */}
            <Timeline />
          </div>
        </div>
      </div>
    </section>
  );
}
