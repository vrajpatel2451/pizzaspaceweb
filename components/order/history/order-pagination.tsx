"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface OrderPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  showPageNumbers?: boolean;
  maxPageButtons?: number;
  className?: string;
}

export function OrderPagination({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  showPageNumbers = true,
  maxPageButtons = 5,
  className,
}: OrderPaginationProps) {
  // Calculate the range of page numbers to display
  const getPageRange = () => {
    if (totalPages <= maxPageButtons) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const half = Math.floor(maxPageButtons / 2);
    let start = Math.max(1, currentPage - half);
    const end = Math.min(totalPages, start + maxPageButtons - 1);

    if (end - start + 1 < maxPageButtons) {
      start = Math.max(1, end - maxPageButtons + 1);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pageRange = getPageRange();
  const showStartEllipsis = pageRange[0] > 1;
  const showEndEllipsis = pageRange[pageRange.length - 1] < totalPages;

  // Calculate the range of items being displayed
  const itemsPerPage = Math.ceil(totalItems / totalPages);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between gap-4",
        className
      )}
    >
      {/* Items Info */}
      <div className="text-sm text-slate-600 dark:text-slate-400">
        Showing <span className="font-medium text-slate-900 dark:text-white">{startItem}</span> to{" "}
        <span className="font-medium text-slate-900 dark:text-white">{endItem}</span> of{" "}
        <span className="font-medium text-slate-900 dark:text-white">{totalItems}</span> orders
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-2">
        {/* Previous Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Previous</span>
        </Button>

        {/* Page Numbers */}
        {showPageNumbers && (
          <div className="flex items-center gap-1">
            {/* First Page + Ellipsis */}
            {showStartEllipsis && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(1)}
                  className="w-9 h-9 p-0"
                >
                  1
                </Button>
                <span className="px-1 text-slate-400">...</span>
              </>
            )}

            {/* Page Number Buttons */}
            {pageRange.map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(page)}
                className={cn(
                  "w-9 h-9 p-0",
                  page === currentPage &&
                    "bg-orange-500 hover:bg-orange-600 text-white"
                )}
              >
                {page}
              </Button>
            ))}

            {/* Last Page + Ellipsis */}
            {showEndEllipsis && (
              <>
                <span className="px-1 text-slate-400">...</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(totalPages)}
                  className="w-9 h-9 p-0"
                >
                  {totalPages}
                </Button>
              </>
            )}
          </div>
        )}

        {/* Next Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="gap-1"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
