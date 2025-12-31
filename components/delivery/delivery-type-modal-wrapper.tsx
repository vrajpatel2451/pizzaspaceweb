"use client";

import { useDeliveryTypeContext } from "@/contexts/delivery-type-context";
import { DeliveryTypeModal } from "./delivery-type-modal";

/**
 * Wrapper component for DeliveryTypeModal that connects to the context.
 * This component should be placed inside the DeliveryTypeProvider.
 */
export function DeliveryTypeModalWrapper() {
  const { showModal, closeModal } = useDeliveryTypeContext();

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      closeModal();
    }
  };

  return (
    <DeliveryTypeModal
      open={showModal}
      onOpenChange={handleOpenChange}
    />
  );
}
