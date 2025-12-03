"use client";

import { useState } from "react";
import { CustomImage } from "@/components/ui/custom-image";
import { cn } from "@/lib/utils";

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
}

interface TeamCardProps {
  member: TeamMember;
  index?: number;
  isVisible?: boolean;
}

export function TeamCard({ member, index = 0, isVisible = true }: TeamCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cn(
        "group relative transition-all duration-600",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}
      style={{ transitionDelay: isVisible ? `${index * 100}ms` : "0ms" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-t from-black/95 via-black/90 to-black/80 flex items-end p-6 transition-all duration-300",
              isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5 pointer-events-none"
            )}
          >
            <p className="text-white text-sm leading-relaxed">
              {member.bio}
            </p>
          </div>

          {/* Name and role - always visible at bottom */}
          <div
            className={cn(
              "absolute bottom-0 left-0 right-0 p-6 transition-all duration-300",
              isHovered ? "opacity-0 translate-y-3" : "opacity-100 translate-y-0"
            )}
          >
            <h3 className="text-lg md:text-xl font-bold text-white mb-1">
              {member.name}
            </h3>
            <p className="text-sm text-orange-300 dark:text-orange-400 font-medium">
              {member.role}
            </p>
          </div>
        </div>

        {/* Decorative accent bar */}
        <div className="h-1 bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700" />
      </div>

      {/* Glow effect on hover */}
      <div
        className={cn(
          "absolute -inset-0.5 bg-gradient-to-r from-orange-500/20 to-orange-600/20 dark:from-orange-500/10 dark:to-orange-600/10 rounded-2xl blur-lg -z-10 transition-opacity duration-300",
          isHovered ? "opacity-100" : "opacity-0"
        )}
      />
    </div>
  );
}
