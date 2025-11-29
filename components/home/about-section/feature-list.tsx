"use client";

import { motion, Variants } from "framer-motion";
import { Sparkles, Leaf, Truck, Award, Check } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
  iconColor: string;
}

const features: Feature[] = [
  {
    icon: Sparkles,
    title: "Premium Quality",
    description: "Only the finest ingredients from trusted suppliers",
    gradient: "from-amber-500 to-orange-600",
    iconColor: "text-amber-500",
  },
  {
    icon: Leaf,
    title: "Fresh Daily",
    description: "Made fresh every day with homemade dough",
    gradient: "from-green-500 to-emerald-600",
    iconColor: "text-green-500",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Hot and fresh at your door in 30 minutes",
    gradient: "from-blue-500 to-cyan-600",
    iconColor: "text-blue-500",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

interface FeatureItemProps {
  feature: Feature;
  index: number;
}

function FeatureItem({ feature, index }: FeatureItemProps) {
  const Icon = feature.icon;

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ x: 8 }}
      transition={{ duration: 0.3 }}
      className="group flex items-start gap-4"
    >
      {/* Icon container */}
      <motion.div
        whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
        transition={{ duration: 0.4 }}
        className="relative flex-shrink-0"
      >
        {/* Gradient background ring */}
        <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-xl opacity-10 group-hover:opacity-20 transition-opacity duration-300 blur-sm`} />

        {/* Icon box */}
        <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-white dark:bg-navy-800 border border-gray-100 dark:border-navy-700 shadow-md shadow-black/5 dark:shadow-black/20 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-black/10 dark:group-hover:shadow-black/30 transition-all duration-300">
          <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${feature.iconColor} transition-transform duration-300 group-hover:scale-110`} />
        </div>

        {/* Animated check badge */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 + index * 0.1, duration: 0.3, type: "spring" }}
          className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow-md"
        >
          <Check className="w-3 h-3 text-white" strokeWidth={3} />
        </motion.div>
      </motion.div>

      {/* Content */}
      <div className="flex-1 min-w-0 pt-1">
        <h4 className="text-base sm:text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
          {feature.title}
        </h4>
        <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">
          {feature.description}
        </p>
      </div>
    </motion.div>
  );
}

export function FeatureList() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className="space-y-5 sm:space-y-6"
    >
      {features.map((feature, index) => (
        <FeatureItem key={feature.title} feature={feature} index={index} />
      ))}
    </motion.div>
  );
}

// Compact feature pills for inline display
export function FeaturePills() {
  const pillFeatures = [
    { icon: Award, label: "Award Winning" },
    { icon: Leaf, label: "Fresh Ingredients" },
    { icon: Truck, label: "Fast Delivery" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="flex flex-wrap gap-2 sm:gap-3"
    >
      {pillFeatures.map((item, index) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 + index * 0.1, duration: 0.3 }}
            whileHover={{ scale: 1.05, y: -2 }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-50 dark:bg-navy-800 rounded-full border border-gray-100 dark:border-navy-700 text-xs sm:text-sm font-medium text-foreground shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300"
          >
            <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
            {item.label}
          </motion.div>
        );
      })}
    </motion.div>
  );
}
