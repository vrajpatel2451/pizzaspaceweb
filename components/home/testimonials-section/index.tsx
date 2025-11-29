"use client";

import { motion } from "framer-motion";
import { TestimonialsHeader } from "./testimonials-header";
import { TestimonialsCarousel } from "./testimonials-carousel";

export function TestimonialsSection() {
  return (
    <section
      className="relative py-16 md:py-24 lg:py-32 overflow-hidden bg-amber-50 dark:bg-slate-900"
      aria-labelledby="testimonials-heading"
    >
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large Quote Mark - Left */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 0.03 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="absolute -left-20 top-20 text-orange-500 dark:text-orange-400"
        >
          <svg
            className="w-80 h-80 md:w-96 md:h-96"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
          </svg>
        </motion.div>

        {/* Large Quote Mark - Right */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 0.03 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="absolute -right-20 bottom-20 text-orange-500 dark:text-orange-400 rotate-180"
        >
          <svg
            className="w-80 h-80 md:w-96 md:h-96"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
          </svg>
        </motion.div>

        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-200/30 dark:bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-200/30 dark:bg-amber-500/10 rounded-full blur-3xl" />

        {/* Subtle Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f97316' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Content Container */}
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <TestimonialsHeader />

        {/* Testimonials Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <TestimonialsCarousel />
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-12 md:mt-16"
        >
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Join our growing community of pizza lovers
          </p>
          <motion.a
            href="#"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-full shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all duration-300"
          >
            <span>Leave Your Review</span>
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </motion.a>
        </motion.div>
      </div>

      {/* Bottom Wave Decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-200 dark:via-orange-800/30 to-transparent" />
    </section>
  );
}
