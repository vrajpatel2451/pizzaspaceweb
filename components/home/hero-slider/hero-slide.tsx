"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { HeroSlide as HeroSlideType } from "./types";
import { CustomImage } from "@/components/ui/custom-image";

interface HeroSlideProps {
  slide: HeroSlideType;
}

export function HeroSlide({ slide }: HeroSlideProps) {
  return (
    <div className="relative h-full min-h-[400px] w-full flex-[0_0_100%]">
      {/* Background Image */}
      <div className="absolute inset-0">
        <CustomImage
          src={slide.image}
          alt={slide.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-black/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full items-center justify-center px-4 text-center">
        <div className="max-w-4xl space-y-6">
          {/* Title */}
          <h1
            className="text-3xl font-bold text-white drop-shadow-lg sm:text-4xl md:text-6xl lg:text-7xl"
            style={{ textShadow: "0 4px 12px rgba(0,0,0,0.5)" }}
          >
            {slide.title}
          </h1>

          {/* Description */}
          <p
            className="text-base text-white/95 drop-shadow-md sm:text-lg md:text-xl lg:text-2xl"
            style={{ textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}
          >
            {slide.description}
          </p>

          {/* CTA Button */}
          <div className="pt-2">
            <Link href={slide.cta.href}>
              <Button
                size="lg"
                className="bg-white text-gray-900 hover:bg-white/90 hover:scale-105 shadow-xl"
              >
                {slide.cta.text}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
