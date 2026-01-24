"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ReservationForm } from "./reservation-form";

interface ReservationDialogProps {
  storeId: string;
  storeName: string;
  openingHours?: { startTime: string; endTime: string };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReservationDialog({
  storeId,
  storeName,
  openingHours,
  open,
  onOpenChange,
}: ReservationDialogProps) {
  const handleSuccess = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
            Reserve a Table
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-600 dark:text-slate-400">
            Book your table at <span className="font-semibold text-orange-600 dark:text-orange-400">{storeName}</span>
          </DialogDescription>
        </DialogHeader>

        <ReservationForm
          storeId={storeId}
          storeName={storeName}
          openingHours={openingHours}
          onSuccess={handleSuccess}
        />
      </DialogContent>
    </Dialog>
  );
}
