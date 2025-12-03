"use client";

import { useState, useRef } from "react";
import { Search, MapPin, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { CategoryResponse } from "@/types/category";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

// Fallback popular searches
const defaultPopularSearches = [
  "Margherita",
  "Pepperoni",
  "BBQ Chicken",
  "Veggie Supreme",
];

interface HeroSearchProps {
  trendingCategories: CategoryResponse[];
}

export function HeroSearch({ trendingCategories }: HeroSearchProps) {
  // Use category names for popular searches if available
  const popularSearches = trendingCategories.length > 0
    ? trendingCategories.slice(0, 4).map((cat) => cat.name)
    : defaultPopularSearches;
  const [searchValue, setSearchValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = () => {
    setSearchValue("");
    inputRef.current?.focus();
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchValue(suggestion);
    setIsFocused(false);
  };

  return (
    <div className="w-full animate-in fade-in-0 slide-in-from-bottom-2 duration-600 motion-reduce:animate-none" style={{ animationDelay: "500ms" }}>
      <div className="relative">
        {/* Main Search Container */}
        <div
          className={cn(
            "relative flex items-center gap-2 bg-white dark:bg-navy-800 rounded-xl sm:rounded-2xl transition-all duration-300 motion-reduce:transition-none",
            "shadow-lg dark:shadow-2xl shadow-black/5 dark:shadow-black/20",
            "border-2",
            isFocused
              ? "border-primary shadow-xl shadow-primary/10 dark:shadow-primary/5"
              : "border-gray-100 dark:border-navy-700"
          )}
        >
          {/* Location Input - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-2 pl-4 pr-3 py-3 border-r border-gray-100 dark:border-navy-700">
            <MapPin className="w-5 h-5 text-primary" aria-hidden="true" />
            <label htmlFor="location-input" className="sr-only">
              Enter your location
            </label>
            <input
              id="location-input"
              type="text"
              placeholder="Your location"
              className="w-28 lg:w-36 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
              aria-label="Enter your location for delivery"
            />
          </div>

          {/* Search Input */}
          <div className="flex-1 flex items-center gap-2 sm:gap-3 pl-3 sm:pl-4 pr-2 py-2.5 sm:py-3 min-h-[44px]">
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground flex-shrink-0" aria-hidden="true" />
            <label htmlFor="search-input" className="sr-only">
              Search for pizzas, sides, and drinks
            </label>
            <input
              id="search-input"
              ref={inputRef}
              type="search"
              placeholder="Search for pizza..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              className="flex-1 bg-transparent text-sm sm:text-base text-foreground placeholder:text-muted-foreground outline-none min-w-0 touch-manipulation"
              aria-label="Search for pizzas, sides, and drinks"
              aria-autocomplete="list"
              aria-controls={isFocused && !searchValue ? "search-suggestions" : undefined}
            />

            {/* Clear Button */}
            {searchValue && (
              <button
                onClick={handleClear}
                className={cn(
                  "p-1.5 sm:p-1 rounded-full hover:bg-gray-100 dark:hover:bg-navy-700 transition-all duration-200 min-w-[28px] min-h-[28px] flex items-center justify-center touch-manipulation motion-reduce:transition-none",
                  "animate-in zoom-in-0 duration-200"
                )}
                aria-label="Clear search input"
              >
                <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" aria-hidden="true" />
              </button>
            )}
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-600 text-white font-semibold px-4 sm:px-6 py-2.5 sm:py-3 m-1 sm:m-1.5 rounded-lg sm:rounded-xl transition-all duration-200 min-h-[40px] touch-manipulation hover:scale-[1.02] active:scale-95 motion-reduce:transition-none motion-reduce:hover:scale-100 motion-reduce:active:scale-100"
            aria-label="Search for menu items"
          >
            <Search className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">Search</span>
          </button>
        </div>

        {/* Suggestions Dropdown */}
        {isFocused && !searchValue && (
          <div
            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-navy-800 rounded-xl shadow-xl dark:shadow-2xl shadow-black/10 dark:shadow-black/30 border border-gray-100 dark:border-navy-700 overflow-hidden z-50 animate-in fade-in-0 slide-in-from-top-2 duration-200 motion-reduce:animate-none"
            id="search-suggestions"
            role="listbox"
            aria-label="Popular search suggestions"
          >
            <div className="p-3">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 px-2">
                Popular Searches
              </p>
              <div className="flex flex-wrap gap-2" role="list">
                {popularSearches.map((suggestion, idx) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-3 py-1.5 bg-gray-100 dark:bg-navy-700 hover:bg-primary/10 dark:hover:bg-primary/20 text-sm text-foreground rounded-lg transition-colors duration-200 min-h-[36px] touch-manipulation motion-reduce:transition-none"
                    role="option"
                    aria-selected={idx === 0}
                    aria-label={`Search for ${suggestion}`}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Trending categories below search */}
      {trendingCategories.length > 0 && (
        <div
          className="mt-3 sm:mt-4 flex flex-wrap items-center gap-2 text-xs sm:text-sm animate-in fade-in-0 duration-500 motion-reduce:animate-none"
          style={{ animationDelay: "700ms" }}
        >
          <span className="text-muted-foreground">Trending:</span>
          {trendingCategories.slice(0, 3).map((category, index) => (
            <div
              key={category._id}
              className="animate-in fade-in-0 slide-in-from-left-2 duration-300 motion-reduce:animate-none"
              style={{ animationDelay: `${800 + index * 100}ms` }}
            >
              <Link href={`/menu?category=${category._id}`}>
                <Badge
                  variant="secondary"
                  className="cursor-pointer hover:bg-primary/20 transition-colors duration-200 min-h-[28px] px-3 py-1 motion-reduce:transition-none"
                >
                  {category.name}
                </Badge>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
