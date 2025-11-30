"use client";

import { useState, useCallback, useTransition } from "react";
import { HeroSection } from "./hero-section";
import { StoresGridSection } from "./stores-grid-section";
import { StoreResponse, PaginationMeta } from "@/types";
import { getStores } from "@/lib/api/stores";

interface StoresClientWrapperProps {
  initialStores: StoreResponse[];
  allStores: StoreResponse[];
  initialMeta: PaginationMeta;
  itemsPerPage: number;
}

export function StoresClientWrapper({
  initialStores,
  allStores,
  initialMeta,
  itemsPerPage,
}: StoresClientWrapperProps) {
  const [stores, setStores] = useState<StoreResponse[]>(initialStores);
  const [meta, setMeta] = useState<PaginationMeta>(initialMeta);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isPending, startTransition] = useTransition();

  // Fetch stores from API with search and pagination
  const fetchStores = useCallback(async (search: string, page: number) => {
    startTransition(async () => {
      try {
        const response = await getStores({
          isActive: true,
          limit: itemsPerPage,
          page,
          search: search || undefined,
        });

        if (response.statusCode === 200 && response.data?.data) {
          setStores(response.data.data);
          setMeta(response.data.meta);
        }
      } catch (error) {
        console.error("Failed to fetch stores:", error);
      }
    });
  }, [itemsPerPage]);

  // Handle search change
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    fetchStores(query, 1);
  }, [fetchStores]);

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    fetchStores(searchQuery, page);
  }, [fetchStores, searchQuery]);

  return (
    <>
      {/* Hero Section with Google Map - Shows all stores on map */}
      <HeroSection stores={allStores} />

      {/* Stores Grid with Search and Pagination */}
      <StoresGridSection
        stores={stores}
        meta={meta}
        searchQuery={searchQuery}
        currentPage={currentPage}
        isLoading={isPending}
        onSearchChange={handleSearchChange}
        onPageChange={handlePageChange}
      />
    </>
  );
}
