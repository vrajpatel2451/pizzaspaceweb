"use client";

import { motion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import Link from "next/link";
import { StoreResponse } from "@/types";
import { StoreCard } from "./store-card";
import { Button } from "@/components/ui/button";

// Section header component
function SectionHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="text-center mb-12 md:mb-16"
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
          Find Us
        </span>
        <span className="h-px w-8 bg-gradient-to-l from-transparent to-orange-500 dark:to-orange-400" aria-hidden="true" />
      </motion.div>

      {/* Main heading */}
      <motion.h2
        id="stores-preview-heading"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4 md:mb-6"
      >
        Visit Our{" "}
        <span className="bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-400 dark:to-orange-500 bg-clip-text text-transparent">
          Locations
        </span>
      </motion.h2>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-slate-600 dark:text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
      >
        Experience authentic Italian pizza at any of our welcoming locations. Find the
        nearest Pizza Space and join us for a memorable meal.
      </motion.p>
    </motion.div>
  );
}

// Background decorations
function BackgroundDecorations() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Gradient orb - top left */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-orange-500/10 to-orange-600/5 dark:from-orange-500/5 dark:to-orange-600/3 rounded-full blur-3xl"
      />

      {/* Floating map pin decoration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="absolute top-20 right-[10%] hidden xl:block"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <MapPin className="w-16 h-16 text-orange-500/20 dark:text-orange-500/10" />
        </motion.div>
      </motion.div>
    </div>
  );
}

interface StoresPreviewSectionProps {
  stores?: StoreResponse[];
}

export function StoresPreviewSection({ stores = [] }: StoresPreviewSectionProps) {

  return (
    <section
      className="relative bg-slate-50 dark:bg-navy-950 py-16 md:py-24 lg:py-32 overflow-hidden"
      aria-labelledby="stores-preview-heading"
    >
      {/* Background decorations */}
      <BackgroundDecorations />

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <SectionHeader />

        {/* Stores grid */}
        {stores.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto mb-12"
          >
            {stores.map((store, index) => (
              <motion.div
                key={store._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <StoreCard store={store} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center py-12"
          >
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              No stores available at the moment. Please check back soon!
            </p>
          </motion.div>
        )}

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex justify-center"
        >
          <Button
            asChild
            size="lg"
            className="group shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Link href="/stores">
              Visit Our Locations
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
