"use client";

import { CategoryResponse } from "@/types";
import { cn } from "@/lib/utils";

interface MenuTabsProps {
  categories: CategoryResponse[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export function MenuTabs({
  categories,
  activeCategory,
  onCategoryChange,
}: MenuTabsProps) {
  return (
    <div
      className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12"
      role="tablist"
      aria-label="Menu categories"
    >
      <button
        onClick={() => onCategoryChange("all")}
        role="tab"
        aria-selected={activeCategory === "all"}
        aria-controls="menu-panel"
        id="tab-all"
        tabIndex={activeCategory === "all" ? 0 : -1}
        className={cn(
          "px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 min-h-[44px] flex items-center",
          activeCategory === "all"
            ? "bg-orange-500 text-white shadow-md"
            : "border-2 border-slate-800 text-slate-800 hover:bg-slate-50"
        )}
      >
        ALL
      </button>
      {categories.map((category) => (
        <button
          key={category._id}
          onClick={() => onCategoryChange(category._id)}
          role="tab"
          aria-selected={activeCategory === category._id}
          aria-controls="menu-panel"
          id={`tab-${category._id}`}
          tabIndex={activeCategory === category._id ? 0 : -1}
          className={cn(
            "px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 min-h-[44px] flex items-center",
            activeCategory === category._id
              ? "bg-orange-500 text-white shadow-md"
              : "border-2 border-slate-800 text-slate-800 hover:bg-slate-50"
          )}
        >
          {category.name.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
