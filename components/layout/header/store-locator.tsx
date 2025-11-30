"use client";

import * as React from "react";
import { MapPin, Check, Loader2, Store } from "lucide-react";
import { useStore } from "@/lib/contexts/store-context";
import { getStores } from "@/lib/api/stores";
import { StoreResponse } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface StoreLocatorProps {
  className?: string;
}

export function StoreLocator({ className }: StoreLocatorProps) {
  const { selectedStore, setSelectedStore } = useStore();
  const [stores, setStores] = React.useState<StoreResponse[]>([]);
  const [isLoadingStores, setIsLoadingStores] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [open, setOpen] = React.useState(false);

  // Fetch stores when dialog opens
  React.useEffect(() => {
    if (open && stores.length === 0) {
      fetchStores();
    }
  }, [open]);

  const fetchStores = async () => {
    setIsLoadingStores(true);
    setError(null);
    try {
      const response = await getStores({ isActive: true });
      if (response.data?.data) {
        setStores(response.data.data);
      } else {
        setError("Failed to load stores");
      }
    } catch (err) {
      console.error("Error fetching stores:", err);
      setError("Failed to load stores. Please try again.");
    } finally {
      setIsLoadingStores(false);
    }
  };

  const handleSelectStore = (store: StoreResponse) => {
    setSelectedStore(store);
    setOpen(false);
  };

  const formatAddress = (store: StoreResponse) => {
    const parts = [store.line1, store.area, store.city, store.zip].filter(
      Boolean
    );
    return parts.join(", ");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "relative gap-2 transition-all",
            "hover:bg-accent/50",
            "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            className
          )}
          aria-label={
            selectedStore
              ? `Selected store: ${selectedStore.name}`
              : "Select a store"
          }
        >
          <MapPin className="size-4 shrink-0" />
          <span className="hidden md:inline-block truncate max-w-[150px] lg:max-w-[200px]">
            {selectedStore ? selectedStore.name : "Select Store"}
          </span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Store className="size-5" />
            Select Your Store
          </DialogTitle>
          <DialogDescription>
            Choose your preferred Pizzaspace location for orders and delivery.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto min-h-0 -mx-6 px-6">
          {isLoadingStores ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-sm text-muted-foreground">
                Loading stores...
              </span>
            </div>
          ) : error ? (
            <div className="py-8 text-center">
              <p className="text-sm text-destructive mb-4">{error}</p>
              <Button variant="outline" size="sm" onClick={fetchStores}>
                Try Again
              </Button>
            </div>
          ) : stores.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-muted-foreground">
                No stores available at the moment.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {stores.map((store) => {
                const isSelected = selectedStore?._id === store._id;
                return (
                  <button
                    key={store._id}
                    onClick={() => handleSelectStore(store)}
                    className={cn(
                      "w-full text-left p-4 rounded-lg border transition-all",
                      "hover:border-primary hover:bg-accent/50",
                      "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-border bg-background"
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3
                            className={cn(
                              "font-semibold text-sm truncate",
                              isSelected ? "text-primary" : "text-foreground"
                            )}
                          >
                            {store.name}
                          </h3>
                          {isSelected && (
                            <Check className="size-4 text-primary shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {formatAddress(store)}
                        </p>
                        {store.phone && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {store.phone}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
