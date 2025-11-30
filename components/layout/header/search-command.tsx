"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Pizza,
  Search,
  MapPin,
  ShoppingCart,
  User,
  Phone,
  Flame,
} from "lucide-react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { getCategories } from "@/lib/api/categories";
import { getProducts } from "@/lib/api/products";
import { formatPrice } from "@/lib/formatters";
import { useDebounce } from "@/hooks/use-debounce";
import type { CategoryResponse, ProductResponse } from "@/types";

interface SearchCommandProps {
  className?: string;
}

interface QuickAction {
  id: string;
  name: string;
  shortcut?: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
}

export function SearchCommand({ className }: SearchCommandProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [categories, setCategories] = React.useState<CategoryResponse[]>([]);
  const [trendingCategories, setTrendingCategories] = React.useState<CategoryResponse[]>([]);
  const [products, setProducts] = React.useState<ProductResponse[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = React.useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<string | null>(null);
  const router = useRouter();

  // Debounce search query
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Handle keyboard shortcut (Cmd/Ctrl + K)
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Fetch categories when popup opens
  React.useEffect(() => {
    if (open && categories.length === 0) {
      Promise.all([
        getCategories({ limit: 5 }),
        getCategories({ limit: 3 })
      ])
        .then(([allCategoriesResponse, trendingResponse]) => {
          if (allCategoriesResponse.data?.data) {
            setCategories(allCategoriesResponse.data.data);
          }
          if (trendingResponse.data?.data) {
            setTrendingCategories(trendingResponse.data.data);
          }
        })
        .catch((error) => {
          console.error("Failed to fetch categories:", error);
        });
    }
  }, [open, categories.length]);

  // Fetch products when search query changes
  React.useEffect(() => {
    if (!debouncedSearchQuery) {
      setProducts([]);
      return;
    }

    setIsLoadingProducts(true);
    getProducts({
      search: debouncedSearchQuery,
      categoryId: selectedCategoryId || undefined,
      limit: 10
    })
      .then((response) => {
        if (response.data?.data) {
          setProducts(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch products:", error);
      })
      .finally(() => {
        setIsLoadingProducts(false);
      });
  }, [debouncedSearchQuery, selectedCategoryId]);

  // Quick actions
  const quickActions: QuickAction[] = React.useMemo(
    () => [
      {
        id: "menu",
        name: "Browse Full Menu",
        shortcut: "M",
        icon: Pizza,
        action: () => {
          router.push("/menu");
          setOpen(false);
        },
      },
      {
        id: "cart",
        name: "View Cart",
        shortcut: "C",
        icon: ShoppingCart,
        action: () => {
          router.push("/cart");
          setOpen(false);
        },
      },
      {
        id: "stores",
        name: "Find Nearest Store",
        shortcut: "S",
        icon: MapPin,
        action: () => {
          router.push("/stores");
          setOpen(false);
        },
      },
      {
        id: "account",
        name: "My Account",
        shortcut: "A",
        icon: User,
        action: () => {
          router.push("/account");
          setOpen(false);
        },
      },
      {
        id: "contact",
        name: "Contact Us",
        icon: Phone,
        action: () => {
          router.push("/contact");
          setOpen(false);
        },
      },
    ],
    [router]
  );

  // Handler for selecting a product
  const handleItemSelect = (productId: string) => {
    router.push(`/menu/${productId}`);
    setOpen(false);
    setSearchQuery("");
  };

  // Handler for category filter
  const handleCategorySelect = (categoryId: string) => {
    if (selectedCategoryId === categoryId) {
      setSelectedCategoryId(null);
    } else {
      setSelectedCategoryId(categoryId);
    }
  };

  // Handler for navigating to category page
  const handleCategoryNavigate = (categoryId: string) => {
    router.push(`/menu?category=${categoryId}`);
    setOpen(false);
    setSearchQuery("");
  };

  return (
    <>
      {/* Search Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "group flex items-center gap-2 px-3 py-2 rounded-full",
          "bg-transparent border border-transparent",
          "hover:bg-accent/50 dark:hover:bg-accent/30",
          "transition-all duration-200 cursor-pointer",
          "text-foreground/60 hover:text-foreground",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 outline-none",
          className
        )}
        aria-label="Search menu (Ctrl+K)"
      >
        <Search className="size-4" />
        <span className="hidden md:inline text-sm">Search</span>
        <kbd className="hidden md:inline-flex h-5 items-center gap-0.5 rounded border bg-muted/50 px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          <span className="text-xs">Ctrl</span>K
        </kbd>
      </button>

      {/* Command Dialog */}
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Search Pizza Space"
        description="Search for menu items, find stores, or navigate quickly"
        showCloseButton={false}
      >
        <Command
          className="rounded-lg"
          shouldFilter={false}
        >
          <CommandInput
            placeholder="Search pizzas, sides, drinks..."
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList className="max-h-[400px]">
            <CommandEmpty>
              <div className="flex flex-col items-center gap-2 py-6">
                <Pizza className="size-10 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">
                  {searchQuery ? `No results found for "${searchQuery}"` : "Start typing to search..."}
                </p>
                <p className="text-xs text-muted-foreground/70">
                  Try searching for pizza, salad, or drinks
                </p>
              </div>
            </CommandEmpty>

            {/* Quick Actions */}
            {!searchQuery && (
              <>
                <CommandGroup heading="Quick Actions">
                  {quickActions.map((action) => (
                    <CommandItem
                      key={action.id}
                      onSelect={action.action}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <div className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                        <action.icon className="size-4" />
                      </div>
                      <span className="font-medium">{action.name}</span>
                      {action.shortcut && (
                        <CommandShortcut>{action.shortcut}</CommandShortcut>
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
                <CommandSeparator />
              </>
            )}

            {/* Trending Categories */}
            {!searchQuery && trendingCategories.length > 0 && (
              <>
                <CommandGroup heading="Trending Categories">
                  <div className="flex flex-wrap gap-2 px-2 py-2">
                    {trendingCategories.map((category) => (
                      <button
                        key={category._id}
                        onClick={() => handleCategoryNavigate(category._id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 hover:bg-primary/20 text-primary text-sm font-medium transition-colors cursor-pointer"
                      >
                        <Flame className="size-3" />
                        {category.name}
                      </button>
                    ))}
                  </div>
                </CommandGroup>
                <CommandSeparator />
              </>
            )}

            {/* Category Filters */}
            {searchQuery && categories.length > 0 && (
              <>
                <CommandGroup heading="Filter by Category">
                  <div className="flex flex-wrap gap-2 px-2 py-2">
                    {categories.map((category) => (
                      <button
                        key={category._id}
                        onClick={() => handleCategorySelect(category._id)}
                        className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer",
                          selectedCategoryId === category._id
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted hover:bg-muted/80 text-muted-foreground"
                        )}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </CommandGroup>
                <CommandSeparator />
              </>
            )}

            {/* Loading State */}
            {isLoadingProducts && (
              <CommandGroup heading="Search Results">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 py-3 px-2">
                    <Skeleton className="size-12 rounded-lg" />
                    <div className="flex flex-1 flex-col gap-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </CommandGroup>
            )}

            {/* Product Results */}
            {!isLoadingProducts && searchQuery && products.length > 0 && (
              <CommandGroup heading={`Search Results (${products.length})`}>
                {products.map((product) => (
                  <CommandItem
                    key={product._id}
                    value={product.name}
                    onSelect={() => handleItemSelect(product._id)}
                    className="flex items-center gap-3 py-3 cursor-pointer"
                  >
                    {/* Product Image */}
                    <div className="relative size-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      {product.photoList[0] ? (
                        <Image
                          src={product.photoList[0]}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      ) : (
                        <div className="flex size-full items-center justify-center">
                          <Pizza className="size-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-1 flex-col gap-0.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate">{product.name}</span>
                        {product.type && (
                          <span className={cn(
                            "text-xs px-1.5 py-0.5 rounded flex-shrink-0",
                            product.type === "veg" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                            product.type === "vegan" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                            "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          )}>
                            {product.type}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground line-clamp-1">
                        {product.description}
                      </span>
                    </div>

                    {/* Price */}
                    <span className="font-semibold text-primary flex-shrink-0">
                      {formatPrice(product.basePrice)}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>

          {/* Footer */}
          <div className="flex items-center justify-between border-t px-3 py-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px]">
                Esc
              </kbd>
              <span>to close</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px]">
                Enter
              </kbd>
              <span>to select</span>
            </div>
          </div>
        </Command>
      </CommandDialog>
    </>
  );
}

// Inline search bar variant for larger screens
// This is a simple wrapper that just shows the search trigger and reuses SearchCommand
export function SearchBar({ className }: { className?: string }) {
  return <SearchCommand className={className} />;
}
