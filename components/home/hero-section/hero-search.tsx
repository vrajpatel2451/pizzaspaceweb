"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, X } from "lucide-react";
import { cn } from "@/lib/utils";

const popularSearches = [
  "Margherita",
  "Pepperoni",
  "BBQ Chicken",
  "Veggie Supreme",
];

export function HeroSearch() {
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="w-full"
    >
      <div className="relative">
        {/* Main Search Container */}
        <motion.div
          className={cn(
            "relative flex items-center gap-2 bg-white dark:bg-navy-800 rounded-xl sm:rounded-2xl transition-all duration-300",
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
            <AnimatePresence>
              {searchValue && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={handleClear}
                  className="p-1.5 sm:p-1 rounded-full hover:bg-gray-100 dark:hover:bg-navy-700 transition-colors min-w-[28px] min-h-[28px] flex items-center justify-center touch-manipulation"
                  aria-label="Clear search input"
                >
                  <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" aria-hidden="true" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Search Button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-600 text-white font-semibold px-4 sm:px-6 py-2.5 sm:py-3 m-1 sm:m-1.5 rounded-lg sm:rounded-xl transition-colors min-h-[40px] touch-manipulation"
            aria-label="Search for menu items"
          >
            <Search className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">Search</span>
          </motion.button>
        </motion.div>

        {/* Suggestions Dropdown */}
        <AnimatePresence>
          {isFocused && !searchValue && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-navy-800 rounded-xl shadow-xl dark:shadow-2xl shadow-black/10 dark:shadow-black/30 border border-gray-100 dark:border-navy-700 overflow-hidden z-50"
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
                      className="px-3 py-1.5 bg-gray-100 dark:bg-navy-700 hover:bg-primary/10 dark:hover:bg-primary/20 text-sm text-foreground rounded-lg transition-colors min-h-[36px] touch-manipulation"
                      role="option"
                      aria-selected={idx === 0}
                      aria-label={`Search for ${suggestion}`}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Popular tags below search */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="mt-3 sm:mt-4 flex flex-wrap items-center gap-2 text-xs sm:text-sm"
      >
        <span className="text-muted-foreground">Trending:</span>
        {["Pizza", "Pasta", "Burgers", "Desserts"].map((tag, index) => (
          <motion.button
            key={tag}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
            onClick={() => setSearchValue(tag)}
            className="text-primary hover:text-primary-600 dark:hover:text-primary-400 font-medium hover:underline transition-colors min-h-[28px] px-1 touch-manipulation"
            aria-label={`Search for ${tag}`}
          >
            {tag}
            {index < 3 && <span className="text-muted-foreground ml-2 hidden sm:inline" aria-hidden="true">|</span>}
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  );
}
