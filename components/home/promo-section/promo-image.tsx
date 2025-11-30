import React from "react";
import Image from "next/image";
import { CustomImage } from "@/components/ui/custom-image";

export function PromoImage() {
  return (
    <div className="relative hidden lg:block">
      {/* Main Pizza Image */}
      <div className="relative z-10">
        <div className="relative aspect-square overflow-hidden rounded-full">
          <CustomImage
            src="/images/pizza-promo.png"
            alt="Delicious pizza promotion"
            width={600}
            height={600}
            className="object-cover transition-transform duration-500 hover:scale-110"
            priority
          />
        </div>

        {/* Floating Decorative Elements */}
        <div className="absolute -right-8 top-1/4 animate-bounce">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-yellow-300 shadow-lg">
            <span className="text-3xl font-bold text-orange-600">%</span>
          </div>
        </div>

        <div
          className="absolute -left-8 bottom-1/4 animate-bounce"
          style={{ animationDelay: "0.5s" }}
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg">
            <span className="text-2xl">🍕</span>
          </div>
        </div>

        <div
          className="absolute right-1/4 -top-8 animate-bounce"
          style={{ animationDelay: "0.25s" }}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500 shadow-lg">
            <span className="text-xl">🔥</span>
          </div>
        </div>
      </div>

      {/* Background Glow Effect */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-yellow-300/30 blur-3xl" />
      </div>

      {/* Decorative Ring */}
      <div className="absolute left-1/2 top-1/2 h-[110%] w-[110%] -translate-x-1/2 -translate-y-1/2 transform rounded-full border-4 border-dashed border-white/30" />
    </div>
  );
}
