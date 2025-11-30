"use client";

import { useState, useEffect, useCallback } from "react";
import { MapPin, Search, X, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { StoreResponse, PaginationMeta } from "@/types";
import { StoreCard } from "@/components/home/stores-section/store-card";
import { StoresSkeleton } from "@/components/home/stores-section/stores-skeleton";
import { useDebounce } from "@/hooks/use-debounce";

interface StoresGridSectionProps {
  stores: StoreResponse[];
  meta: PaginationMeta;
  searchQuery: string;
  currentPage: number;
  isLoading?: boolean;
  onSearchChange: (query: string) => void;
  onPageChange: (page: number) => void;
}

export function StoresGridSection({
  stores,
  meta,
  searchQuery,
  currentPage,
  isLoading = false,
  onSearchChange,
  onPageChange,
}: StoresGridSectionProps) {
  const [inputValue, setInputValue] = useState(searchQuery);
  const [isFocused, setIsFocused] = useState(false);
  const debouncedSearch = useDebounce(inputValue, 400);

  // Trigger search when debounced value changes
  useEffect(() => {
    if (debouncedSearch !== searchQuery) {
      onSearchChange(debouncedSearch);
    }
  }, [debouncedSearch, searchQuery, onSearchChange]);

  // Handle input change
  const handleInputChange = useCallback((value: string) => {
    setInputValue(value);
  }, []);

  // Clear search
  const handleClearSearch = useCallback(() => {
    setInputValue("");
    onSearchChange("");
  }, [onSearchChange]);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    const totalPages = meta.totalPages;

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("ellipsis");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("ellipsis");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  if (isLoading && stores.length === 0) {
    return (
      <section className="py-16 lg:py-24 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 lg:px-6">
          <StoresSkeleton />
        </div>
      </section>
    );
  }

  return (
    <section
      className="py-12 sm:py-16 lg:py-24 bg-gradient-to-b from-white to-orange-50/30 dark:from-slate-900 dark:to-slate-900"
      aria-labelledby="stores-grid-heading"
    >
      <div className="container mx-auto px-4 lg:px-6">
        {/* Section Header */}
        <motion.div
          className="text-center mb-10 sm:mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 mb-4">
            <MapPin className="w-4 h-4 text-orange-600 dark:text-orange-400" aria-hidden="true" />
            <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
              Our Locations
            </span>
          </div>
          <h2
            id="stores-grid-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-50 mb-4"
          >
            All Pizza Space Stores
          </h2>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Browse all our locations and find the perfect spot for your next pizza experience
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          className="max-w-xl mx-auto mb-10 sm:mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div
            className={`
              relative flex items-center
              bg-white dark:bg-slate-800
              rounded-2xl
              border-2 transition-all duration-300
              ${isFocused
                ? 'border-orange-500 shadow-lg shadow-orange-500/20 dark:shadow-orange-500/10'
                : 'border-gray-200 dark:border-slate-700 shadow-md hover:border-gray-300 dark:hover:border-slate-600'
              }
            `}
          >
            <div className="pl-5 pr-3 py-4">
              {isLoading ? (
                <Loader2 className="w-5 h-5 text-orange-500 animate-spin" aria-hidden="true" />
              ) : (
                <Search
                  className={`w-5 h-5 transition-colors duration-300 ${
                    isFocused ? 'text-orange-500' : 'text-gray-400 dark:text-gray-500'
                  }`}
                  aria-hidden="true"
                />
              )}
            </div>
            <input
              type="text"
              placeholder="Search stores by name, area, or city..."
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="
                flex-1 py-4 pr-4
                bg-transparent
                text-base text-gray-900 dark:text-gray-100
                placeholder:text-gray-400 dark:placeholder:text-gray-500
                focus:outline-none
              "
              aria-label="Search stores"
            />
            <AnimatePresence>
              {inputValue && (
                <motion.button
                  type="button"
                  onClick={handleClearSearch}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                  className="
                    mr-3 p-2
                    rounded-full
                    bg-gray-100 dark:bg-slate-700
                    hover:bg-gray-200 dark:hover:bg-slate-600
                    text-gray-500 dark:text-gray-400
                    transition-colors
                  "
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-center" role="status" aria-live="polite">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {searchQuery ? (
                <>
                  Found <span className="font-semibold text-orange-600 dark:text-orange-400">{meta.totalItems}</span> store{meta.totalItems !== 1 ? 's' : ''} matching &quot;{searchQuery}&quot;
                </>
              ) : (
                <>
                  Showing <span className="font-semibold text-orange-600 dark:text-orange-400">{meta.totalItems}</span> stores
                </>
              )}
            </span>
          </div>
        </motion.div>

        {/* Stores Grid */}
        <AnimatePresence mode="wait">
          {stores.length > 0 ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 ${isLoading ? 'opacity-50' : ''}`}>
                {stores.map((store, index) => (
                  <motion.div
                    key={store._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <StoreCard store={store} />
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {meta.totalPages > 1 && (
                <motion.nav
                  className="mt-12 flex justify-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  aria-label="Stores pagination"
                >
                  <div className="flex items-center gap-2">
                    {/* Previous Button */}
                    <button
                      type="button"
                      onClick={() => onPageChange(currentPage - 1)}
                      disabled={!meta.hasPrevPage || isLoading}
                      className={`
                        flex items-center gap-1 px-4 py-2.5
                        rounded-xl font-medium text-sm
                        transition-all duration-200
                        ${meta.hasPrevPage && !isLoading
                          ? 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-slate-700 hover:border-orange-300 dark:hover:border-orange-700 hover:text-orange-600 dark:hover:text-orange-400 shadow-sm'
                          : 'bg-gray-100 dark:bg-slate-800/50 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                        }
                      `}
                      aria-label="Previous page"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span className="hidden sm:inline">Previous</span>
                    </button>

                    {/* Page Numbers */}
                    <div className="flex items-center gap-1">
                      {getPageNumbers().map((page, index) => (
                        page === "ellipsis" ? (
                          <span
                            key={`ellipsis-${index}`}
                            className="px-2 text-gray-400 dark:text-gray-500"
                          >
                            ...
                          </span>
                        ) : (
                          <button
                            key={page}
                            type="button"
                            onClick={() => onPageChange(page)}
                            disabled={isLoading}
                            className={`
                              w-10 h-10 rounded-xl font-medium text-sm
                              transition-all duration-200
                              ${page === currentPage
                                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                                : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-slate-700 hover:border-orange-300 dark:hover:border-orange-700 hover:text-orange-600 dark:hover:text-orange-400 shadow-sm'
                              }
                              ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                            `}
                            aria-label={`Page ${page}`}
                            aria-current={page === currentPage ? "page" : undefined}
                          >
                            {page}
                          </button>
                        )
                      ))}
                    </div>

                    {/* Next Button */}
                    <button
                      type="button"
                      onClick={() => onPageChange(currentPage + 1)}
                      disabled={!meta.hasNextPage || isLoading}
                      className={`
                        flex items-center gap-1 px-4 py-2.5
                        rounded-xl font-medium text-sm
                        transition-all duration-200
                        ${meta.hasNextPage && !isLoading
                          ? 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-slate-700 hover:border-orange-300 dark:hover:border-orange-700 hover:text-orange-600 dark:hover:text-orange-400 shadow-sm'
                          : 'bg-gray-100 dark:bg-slate-800/50 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                        }
                      `}
                      aria-label="Next page"
                    >
                      <span className="hidden sm:inline">Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.nav>
              )}

              {/* Page Info */}
              {meta.totalPages > 1 && (
                <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  Page {meta.currentPage} of {meta.totalPages} ({meta.totalItems} total stores)
                </p>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              className="text-center py-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              role="status"
              aria-live="polite"
            >
              <div
                className="w-24 h-24 bg-orange-100 dark:bg-orange-950/30 rounded-full flex items-center justify-center mx-auto mb-6"
                aria-hidden="true"
              >
                <Search className="w-10 h-10 text-orange-400 dark:text-orange-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-3">
                No Stores Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                We couldn&apos;t find any stores matching &quot;{searchQuery}&quot;. Try a different search term.
              </p>
              <button
                onClick={handleClearSearch}
                className="
                  inline-flex items-center gap-2
                  px-6 py-3
                  bg-orange-500 hover:bg-orange-600
                  text-white font-medium
                  rounded-xl
                  transition-colors
                "
                type="button"
                aria-label="Clear search and show all stores"
              >
                <X className="w-4 h-4" />
                Clear Search
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
