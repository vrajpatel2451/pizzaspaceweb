"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface InfoCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function InfoCard({ icon: Icon, title, description }: InfoCardProps) {
  return (
    <div
      className="group relative flex flex-col items-center gap-3 sm:gap-4 rounded-xl sm:rounded-2xl bg-white p-5 sm:p-6 dark:bg-navy-800 touch-manipulation transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100"
      role="article"
      aria-label={`${title}: ${description}`}
      style={{ boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
    >
      {/* Icon Container */}
      <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-orange-100 text-orange-500 transition-all duration-300 group-hover:bg-orange-500 group-hover:text-white dark:bg-orange-950 dark:text-orange-400 dark:group-hover:bg-orange-500 dark:group-hover:text-white motion-reduce:transition-none">
        <Icon className="h-7 w-7 sm:h-8 sm:w-8" aria-hidden="true" />
      </div>

      {/* Content */}
      <div className="text-center">
        <h3
          className="text-base sm:text-lg font-bold text-navy-900 dark:text-white transition-transform duration-200 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        >
          {title}
        </h3>
        <p
          className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-gray-600 dark:text-gray-300 transition-opacity duration-200 group-hover:opacity-100 opacity-80 motion-reduce:transition-none"
        >
          {description}
        </p>
      </div>

      {/* Decorative Accent */}
      <div
        className="absolute inset-x-0 bottom-0 h-1 rounded-b-xl sm:rounded-b-2xl bg-gradient-to-r from-orange-400 to-orange-600 origin-left transition-all duration-300 scale-x-0 group-hover:scale-x-100 motion-reduce:transition-none motion-reduce:group-hover:scale-x-0"
      />
    </div>
  );
}
