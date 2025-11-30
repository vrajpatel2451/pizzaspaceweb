"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

interface ProductPaginationProps {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * ProductPagination - Client Component
 *
 * Renders pagination controls using shadcn Pagination component.
 * Features:
 * - Smart ellipsis logic for large page sets
 * - Previous/Next buttons with disabled states
 * - URL-based navigation (updates search params)
 * - Active page highlighting
 * - Accessibility (aria-current, aria-label)
 */
export function ProductPagination({
  currentPage,
  totalPages,
  hasNextPage,
  hasPrevPage,
}: ProductPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  /**
   * Generate page numbers with smart ellipsis
   * Shows max 7 pages: [1] ... [n-1] [n] [n+1] ... [total]
   */
  const getPageNumbers = (): (number | string)[] => {
    // If total pages <= 7, show all
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [1];

    // Add ellipsis if current page is far from start
    if (currentPage > 3) {
      pages.push("...");
    }

    // Add pages around current page
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }

    // Add ellipsis if current page is far from end
    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

    // Always show last page if > 1
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  /**
   * Navigate to a specific page
   * Updates URL search params and pushes to router
   */
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Don't render if only one page
  if (totalPages <= 1) {
    return null;
  }

  const pageNumbers = getPageNumbers();

  return (
    <Pagination className="mt-8 mb-6 lg:mb-0" aria-label="Product pagination">
      <PaginationContent className="gap-1.5 sm:gap-2">
        {/* Previous Button */}
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (hasPrevPage) {
                handlePageChange(currentPage - 1);
              }
            }}
            aria-disabled={!hasPrevPage}
            aria-label="Go to previous page"
            tabIndex={hasPrevPage ? 0 : -1}
            className={cn(
              "min-h-[44px] h-9 sm:h-10 px-2 sm:px-4 text-xs sm:text-sm",
              "transition-all duration-150 touch-manipulation",
              "hover:bg-orange-50 dark:hover:bg-orange-950 hover:text-orange-600",
              !hasPrevPage && "pointer-events-none opacity-50"
            )}
          />
        </PaginationItem>

        {/* Page Numbers */}
        {pageNumbers.map((page, idx) => (
          <PaginationItem key={idx}>
            {page === "..." ? (
              <PaginationEllipsis className="text-slate-400 w-6 sm:w-10" />
            ) : (
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(Number(page));
                }}
                isActive={currentPage === Number(page)}
                aria-current={currentPage === Number(page) ? "page" : undefined}
                aria-label={`Page ${page}`}
                className={cn(
                  "h-9 w-9 sm:h-10 sm:w-10 rounded-lg border text-xs sm:text-sm font-medium",
                  "transition-all duration-150 touch-manipulation",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500",
                  currentPage === Number(page)
                    ? "bg-orange-500 text-white border-orange-500 hover:bg-orange-600"
                    : "border-slate-200 dark:border-slate-700 hover:bg-orange-50 dark:hover:bg-orange-950 hover:border-orange-200 dark:hover:border-orange-900 hover:text-orange-600 dark:hover:text-orange-400 sm:hover:scale-105 hover:shadow-md"
                )}
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        {/* Next Button */}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (hasNextPage) {
                handlePageChange(currentPage + 1);
              }
            }}
            aria-disabled={!hasNextPage}
            aria-label="Go to next page"
            tabIndex={hasNextPage ? 0 : -1}
            className={cn(
              "min-h-[44px] h-9 sm:h-10 px-2 sm:px-4 text-xs sm:text-sm",
              "transition-all duration-150 touch-manipulation",
              "hover:bg-orange-50 dark:hover:bg-orange-950 hover:text-orange-600",
              !hasNextPage && "pointer-events-none opacity-50"
            )}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
