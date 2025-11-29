"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Pizza,
  Search,
  Clock,
  MapPin,
  ShoppingCart,
  User,
  Phone,
  Star,
  Flame,
  Salad,
  Coffee,
  IceCream,
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
import { cn } from "@/lib/utils";

interface SearchCommandProps {
  className?: string;
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: string;
  price: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface QuickAction {
  id: string;
  name: string;
  shortcut?: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
}

// Sample menu items - in production, this would come from API
const popularItems: MenuItem[] = [
  {
    id: "margherita",
    name: "Margherita Pizza",
    description: "Classic tomato sauce, mozzarella, fresh basil",
    category: "Pizzas",
    price: "12.99",
    icon: Pizza,
  },
  {
    id: "pepperoni",
    name: "Pepperoni Pizza",
    description: "Pepperoni, mozzarella, tomato sauce",
    category: "Pizzas",
    price: "14.99",
    icon: Pizza,
  },
  {
    id: "bbq-chicken",
    name: "BBQ Chicken Pizza",
    description: "BBQ sauce, grilled chicken, red onions",
    category: "Pizzas",
    price: "15.99",
    icon: Flame,
  },
  {
    id: "caesar-salad",
    name: "Caesar Salad",
    description: "Romaine lettuce, parmesan, croutons, caesar dressing",
    category: "Sides",
    price: "8.99",
    icon: Salad,
  },
  {
    id: "garlic-bread",
    name: "Garlic Bread",
    description: "Freshly baked with garlic butter and herbs",
    category: "Sides",
    price: "4.99",
  },
];

export function SearchCommand({ className }: SearchCommandProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const router = useRouter();

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

  // Filter items based on search
  const filteredItems = React.useMemo(() => {
    if (!searchQuery) return popularItems;

    const query = searchQuery.toLowerCase();
    return popularItems.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleItemSelect = (itemId: string) => {
    router.push(`/menu/${itemId}`);
    setOpen(false);
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
                  No results found for &quot;{searchQuery}&quot;
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

            {/* Menu Items */}
            <CommandGroup
              heading={searchQuery ? "Search Results" : "Popular Items"}
            >
              {filteredItems.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.name}
                  onSelect={() => handleItemSelect(item.id)}
                  className="flex items-center gap-3 py-3 cursor-pointer"
                >
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    {item.icon ? (
                      <item.icon className="size-5" />
                    ) : (
                      <Pizza className="size-5" />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                        {item.category}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground line-clamp-1">
                      {item.description}
                    </span>
                  </div>
                  <span className="font-semibold text-primary">
                    {item.price} GBP
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>

            {/* Recently Viewed - placeholder for future implementation */}
            {!searchQuery && (
              <>
                <CommandSeparator />
                <CommandGroup heading="Recently Viewed">
                  <CommandItem
                    onSelect={() => handleItemSelect("margherita")}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <div className="flex size-8 items-center justify-center rounded-md bg-muted">
                      <Clock className="size-4 text-muted-foreground" />
                    </div>
                    <span className="text-muted-foreground">Margherita Pizza</span>
                    <span className="ml-auto text-xs text-muted-foreground/70">
                      2 hours ago
                    </span>
                  </CommandItem>
                </CommandGroup>
              </>
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
export function SearchBar({ className }: { className?: string }) {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(true);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "flex items-center gap-3 w-full max-w-sm",
          "px-4 py-2.5 rounded-full",
          "bg-muted/50 hover:bg-muted",
          "border border-transparent hover:border-border",
          "transition-all duration-200 cursor-pointer",
          "text-muted-foreground",
          "focus-visible:ring-2 focus-visible:ring-ring outline-none",
          className
        )}
      >
        <Search className="size-4" />
        <span className="flex-1 text-left text-sm">Search menu...</span>
        <kbd className="hidden sm:inline-flex h-5 items-center gap-0.5 rounded border bg-background px-1.5 font-mono text-[10px] font-medium">
          <span className="text-xs">Ctrl</span>K
        </kbd>
      </button>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Search Pizza Space"
        description="Search for menu items"
        showCloseButton={false}
      >
        <Command shouldFilter={true}>
          <CommandInput placeholder="Search pizzas, sides, drinks..." />
          <CommandList className="max-h-[400px]">
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Popular Items">
              {popularItems.map((item) => (
                <CommandItem key={item.id} className="cursor-pointer">
                  <Pizza className="mr-2 size-4" />
                  <span>{item.name}</span>
                  <span className="ml-auto text-muted-foreground">
                    {item.price} GBP
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
