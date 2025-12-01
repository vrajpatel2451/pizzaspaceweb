"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Drawer } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, X } from "lucide-react";
import { DiscountResponse } from "@/types";
import { DiscountCard } from "./discount-card";
import { EmptyDiscounts } from "./empty-discounts";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";

interface DiscountModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  discounts: DiscountResponse[];
  appliedDiscountIds: string[];
  isLoading?: boolean;
  onApply: (discountId: string) => Promise<void>;
  className?: string;
}

export function DiscountModal({
  open,
  onOpenChange,
  discounts,
  appliedDiscountIds,
  isLoading = false,
  onApply,
  className,
}: DiscountModalProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Debounce search input
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter discounts based on search
  const filteredDiscounts = React.useMemo(() => {
    if (!debouncedSearch.trim()) {
      return discounts;
    }

    const query = debouncedSearch.toLowerCase();
    return discounts.filter(
      (discount) =>
        discount.name.toLowerCase().includes(query) ||
        discount.couponCode.toLowerCase().includes(query) ||
        discount.description.toLowerCase().includes(query)
    );
  }, [discounts, debouncedSearch]);

  const handleClearSearch = () => {
    setSearchQuery("");
    setDebouncedSearch("");
  };

  const content = (
    <div className="flex flex-col h-full">
      {/* Search Input */}
      <div className="px-4 pb-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search discounts by name or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10"
            aria-label="Search discounts"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Clear search"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </div>

      {/* Discounts List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {isLoading ? (
            // Loading Skeletons
            <>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-3 p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                    <Skeleton className="h-10 w-20" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))}
            </>
          ) : filteredDiscounts.length === 0 ? (
            // Empty State
            <EmptyDiscounts
              message={
                debouncedSearch
                  ? `No discounts found matching "${debouncedSearch}"`
                  : "No discounts available at the moment"
              }
            />
          ) : (
            // Discount Cards
            <>
              {filteredDiscounts.map((discount) => (
                <DiscountCard
                  key={discount._id}
                  discount={discount}
                  isApplied={appliedDiscountIds.includes(discount._id)}
                  onApply={onApply}
                />
              ))}
            </>
          )}
        </div>
      </ScrollArea>

      {/* Results Count */}
      {!isLoading && filteredDiscounts.length > 0 && (
        <div className="px-4 py-3 border-t text-sm text-muted-foreground text-center">
          Showing {filteredDiscounts.length} of {discounts.length} discounts
        </div>
      )}
    </div>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className={cn("max-w-2xl max-h-[85vh] p-0", className)}>
          <DialogHeader className="px-4 pt-6 pb-4 border-b">
            <DialogTitle>Available Discounts</DialogTitle>
            <DialogDescription>
              Browse and apply discounts to your order
            </DialogDescription>
          </DialogHeader>
          {content}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer
      isOpen={open}
      onClose={() => onOpenChange(false)}
      title="Available Discounts"
      subtitle="Browse and apply discounts to your order"
      side="bottom"
      size="full"
    >
      {content}
    </Drawer>
  );
}
