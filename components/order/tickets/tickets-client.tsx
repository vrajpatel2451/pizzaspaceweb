"use client";

import React, { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { OrderTicketResponse } from "@/types/orderTicket";
import { TicketGrid, TicketGridSkeleton } from "./ticket-grid";
import { OrderPagination } from "../history/order-pagination";
import { CreateTicketDialog } from "./create-ticket-dialog";

interface TicketsClientProps {
  orderId: string;
  storeId: string;
  initialTickets: OrderTicketResponse[];
  initialPagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  errorMessage?: string;
}

export function TicketsClient({
  orderId,
  storeId,
  initialTickets,
  initialPagination,
  errorMessage,
}: TicketsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    startTransition(() => {
      router.push(`/order/${orderId}/tickets?${params.toString()}`);
    });
  };

  const handleTicketCreated = () => {
    // Refresh the page to show the new ticket
    router.refresh();
  };

  const isLoading = isPending;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Create Ticket Button */}
      <div className="flex justify-end">
        <CreateTicketDialog
          orderId={orderId}
          storeId={storeId}
          onSuccess={handleTicketCreated}
        />
      </div>

      {/* Ticket Grid */}
      {isLoading ? (
        <TicketGridSkeleton />
      ) : (
        <TicketGrid
          tickets={initialTickets}
          errorMessage={errorMessage}
          onCreateTicket={handleTicketCreated}
        />
      )}

      {/* Pagination */}
      {initialPagination.totalPages > 1 && !isLoading && (
        <OrderPagination
          currentPage={initialPagination.page}
          totalPages={initialPagination.totalPages}
          totalItems={initialPagination.total}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
