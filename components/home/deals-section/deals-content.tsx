"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductResponse } from "@/types";
import { DealCard } from "./deal-card";
import { cn } from "@/lib/utils";

interface DealsContentProps {
  products: ProductResponse[];
}

export function DealsContent({ products }: DealsContentProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll, { passive: true });
      return () => el.removeEventListener("scroll", checkScroll);
    }
  }, []);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = 340;
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative group/carousel">
      {/* Scroll Buttons */}
      <button
        onClick={() => scroll("left")}
        className={cn(
          "absolute -left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center transition-all duration-300",
          "hover:bg-white/20 hover:scale-110",
          canScrollLeft
            ? "opacity-0 group-hover/carousel:opacity-100"
            : "opacity-0 pointer-events-none"
        )}
        aria-label="Scroll deals left"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={() => scroll("right")}
        className={cn(
          "absolute -right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center transition-all duration-300",
          "hover:bg-white/20 hover:scale-110",
          canScrollRight
            ? "opacity-0 group-hover/carousel:opacity-100"
            : "opacity-0 pointer-events-none"
        )}
        aria-label="Scroll deals right"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Edge Fades */}
      <div
        className={cn(
          "absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-slate-950 to-transparent z-20 pointer-events-none transition-opacity duration-300",
          canScrollLeft ? "opacity-100" : "opacity-0"
        )}
      />
      <div
        className={cn(
          "absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-slate-950 to-transparent z-20 pointer-events-none transition-opacity duration-300",
          canScrollRight ? "opacity-100" : "opacity-0"
        )}
      />

      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory"
        style={{ WebkitOverflowScrolling: "touch" }}
        role="list"
        aria-label="Deals products"
      >
        {products.map((product, i) => (
          <div key={product._id} className="snap-start" role="listitem">
            <DealCard product={product} index={i} priority={i < 3} />
          </div>
        ))}
      </div>
    </div>
  );
}
