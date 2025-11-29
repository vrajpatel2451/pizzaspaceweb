"use client";

import React, { useRef } from "react";
import { motion, useInView, Variants } from "framer-motion";
import { Clock, Truck, Gift, CheckCircle } from "lucide-react";
import { InfoCard } from "./info-card";

// Animation variants for container
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

// Animation variants for section header
const headerVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

// Animation variants for cards
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

export function DeliveryInfoSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const deliveryInfo = [
    {
      icon: Clock,
      title: "09:00 - 23:00",
      description: "Open Daily",
    },
    {
      icon: Truck,
      title: "30-45 min",
      description: "Fast Delivery",
    },
    {
      icon: Gift,
      title: "Orders $30+",
      description: "Free Delivery",
    },
    {
      icon: CheckCircle,
      title: "Always Fresh",
      description: "Quality Guaranteed",
    },
  ];

  return (
    <section
      ref={ref}
      className="w-full bg-amber-50 py-12 sm:py-16 lg:py-20 dark:bg-navy-900"
      aria-labelledby="delivery-info-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={headerVariants}
          className="mb-8 sm:mb-12 text-center"
        >
          <motion.h2
            id="delivery-info-heading"
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-navy-900 dark:text-white"
          >
            Our Delivery Service
          </motion.h2>
          <motion.p
            className="mt-2 sm:mt-3 text-sm sm:text-base text-gray-600 dark:text-gray-300"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Fast, reliable, and fresh pizza delivered to your door
          </motion.p>
        </motion.div>

        {/* Info Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {deliveryInfo.map((info, index) => (
            <motion.div key={index} variants={cardVariants}>
              <InfoCard
                icon={info.icon}
                title={info.title}
                description={info.description}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
