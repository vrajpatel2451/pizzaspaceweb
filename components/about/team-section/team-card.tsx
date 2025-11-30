"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CustomImage } from "@/components/ui/custom-image";

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
}

interface TeamCardProps {
  member: TeamMember;
  delay?: number;
}

export function TeamCard({ member, delay = 0 }: TeamCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative"
    >
      {/* Card container */}
      <div className="relative h-full bg-white dark:bg-navy-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-navy-700 shadow-md dark:shadow-navy-950/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        {/* Image container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-slate-100 dark:bg-navy-700">
          <CustomImage
            src={member.image}
            alt={`${member.name} - ${member.role}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            loading="lazy"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Bio overlay - appears on hover */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/90 to-black/80 flex items-end p-6"
              >
                <p className="text-white text-sm leading-relaxed">
                  {member.bio}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Name and role - always visible at bottom */}
          <AnimatePresence>
            {!isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                className="absolute bottom-0 left-0 right-0 p-6"
              >
                <h3 className="text-lg md:text-xl font-bold text-white mb-1">
                  {member.name}
                </h3>
                <p className="text-sm text-orange-300 dark:text-orange-400 font-medium">
                  {member.role}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Decorative accent bar */}
        <div className="h-1 bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700" />
      </div>

      {/* Glow effect on hover */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute -inset-0.5 bg-gradient-to-r from-orange-500/20 to-orange-600/20 dark:from-orange-500/10 dark:to-orange-600/10 rounded-2xl blur-lg -z-10"
      />
    </motion.div>
  );
}
