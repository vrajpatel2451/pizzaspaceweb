"use client";

import { SubCategoryResponse } from "@/types";
import { cn } from "@/lib/utils";

interface SubcategoryListProps {
  categoryId: string;
  subcategories: SubCategoryResponse[];
  activeSubcategory?: string;
  onSelect: (categoryId: string, subcategoryId: string) => void;
}

/**
 * SubcategoryList - Client Component
 *
 * Purpose: Renders clickable subcategory items
 * - Displays subcategories as interactive buttons
 * - Highlights active subcategory from URL params
 * - Updates URL on selection via callback
 */
export function SubcategoryList({
  categoryId,
  subcategories,
  activeSubcategory,
  onSelect,
}: SubcategoryListProps) {
  return (
    <ul className="space-y-1 pl-12 mt-2" role="list">
      {subcategories.map((sub) => {
        const isActive = activeSubcategory === sub._id;

        return (
          <li key={sub._id}>
            <button
              onClick={() => onSelect(categoryId, sub._id)}
              className={cn(
                "relative w-full text-left px-4 py-2 rounded-md text-sm transition-all duration-150",
                "hover:bg-slate-100 dark:hover:bg-slate-800",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2",
                isActive
                  ? "bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-300 font-semibold"
                  : "text-slate-700 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400"
              )}
              aria-current={isActive ? "page" : undefined}
              aria-label={`Filter by ${sub.name}`}
            >
              {/* Active indicator dot */}
              {isActive && (
                <span
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-orange-500 dark:bg-orange-400"
                  aria-hidden="true"
                />
              )}

              <span className={cn(isActive && "pl-2")}>{sub.name}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
