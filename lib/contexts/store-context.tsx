"use client";

import * as React from "react";
import { StoreResponse } from "@/types";

interface StoreContextType {
  selectedStore: StoreResponse | null;
  setSelectedStore: (store: StoreResponse) => void;
  clearStore: () => void;
  isLoading: boolean;
}

const StoreContext = React.createContext<StoreContextType | undefined>(
  undefined
);

const STORE_STORAGE_KEY = "pizzaspace-selected-store";
const STORE_COOKIE_NAME = "selectedStoreId";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [selectedStore, setSelectedStoreState] =
    React.useState<StoreResponse | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  // Load store from localStorage on mount
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(STORE_STORAGE_KEY);
      if (stored) {
        const store = JSON.parse(stored) as StoreResponse;
        setSelectedStoreState(store);
      }
    } catch (error) {
      console.error("Failed to load store from localStorage:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setSelectedStore = React.useCallback((store: StoreResponse) => {
    setSelectedStoreState(store);

    // Persist to localStorage
    try {
      localStorage.setItem(STORE_STORAGE_KEY, JSON.stringify(store));
    } catch (error) {
      console.error("Failed to save store to localStorage:", error);
    }

    // Persist to cookies for server access
    try {
      document.cookie = `${STORE_COOKIE_NAME}=${store._id}; path=/; max-age=31536000; SameSite=Lax`;
    } catch (error) {
      console.error("Failed to set store cookie:", error);
    }
  }, []);

  const clearStore = React.useCallback(() => {
    setSelectedStoreState(null);

    // Clear localStorage
    try {
      localStorage.removeItem(STORE_STORAGE_KEY);
    } catch (error) {
      console.error("Failed to clear store from localStorage:", error);
    }

    // Clear cookie
    try {
      document.cookie = `${STORE_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
    } catch (error) {
      console.error("Failed to clear store cookie:", error);
    }
  }, []);

  const value = React.useMemo(
    () => ({
      selectedStore,
      setSelectedStore,
      clearStore,
      isLoading,
    }),
    [selectedStore, setSelectedStore, clearStore, isLoading]
  );

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore() {
  const context = React.useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
