"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import Image from "next/image";

const customerAvatars = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    alt: "Customer Sarah",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    alt: "Customer John",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    alt: "Customer Emily",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    alt: "Customer Michael",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
    alt: "Customer Lisa",
  },
];

export function TestimonialsHeader() {
  return (
    <div className="text-center mb-12 md:mb-16">
      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <span className="inline-flex items-center gap-2 bg-orange-100 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 px-4 py-2 rounded-full text-sm font-medium">
          <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
          Testimonials
        </span>
      </motion.div>

      {/* Headline */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-3xl md:text-4xl lg:text-5xl font-bold mt-6 text-slate-900 dark:text-white"
      >
        What Our Customers Say
      </motion.h2>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-slate-600 dark:text-slate-400 mt-4 max-w-2xl mx-auto text-base md:text-lg"
      >
        Join thousands of satisfied customers who have made Pizza Space their go-to destination for authentic, delicious pizza.
      </motion.p>

      {/* Rating and Avatars Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8"
      >
        {/* Rating Display */}
        <div className="flex items-center gap-3 bg-white dark:bg-slate-800 px-5 py-3 rounded-2xl shadow-lg shadow-orange-500/10 border border-orange-100 dark:border-slate-700">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < 5
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-gray-200 text-gray-200"
                }`}
              />
            ))}
          </div>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
          <div className="text-left">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">4.8</span>
            <span className="text-slate-500 dark:text-slate-400 text-sm ml-1">/ 5</span>
          </div>
        </div>

        {/* Divider on larger screens */}
        <div className="hidden sm:block h-12 w-px bg-slate-200 dark:bg-slate-700" />

        {/* Customer Avatars with Count */}
        <div className="flex items-center gap-3">
          <div className="flex -space-x-3">
            {customerAvatars.map((avatar, index) => (
              <motion.div
                key={avatar.id}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                className="relative"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-3 border-white dark:border-slate-800 overflow-hidden shadow-md hover:scale-110 hover:z-10 transition-transform duration-200">
                  <Image
                    src={avatar.src}
                    alt={avatar.alt}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>
            ))}
            {/* More customers indicator */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.65 }}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full border-3 border-white dark:border-slate-800 bg-orange-500 flex items-center justify-center shadow-md"
            >
              <span className="text-white text-xs md:text-sm font-semibold">+2K</span>
            </motion.div>
          </div>
          <div className="text-left">
            <p className="text-slate-900 dark:text-white font-semibold text-sm md:text-base">2.5K+ Reviews</p>
            <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm">Happy Customers</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
