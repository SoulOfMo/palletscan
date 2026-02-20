"use client";
import { useCallback } from "react";
import type { PalletWithCount } from "@/lib/db/schema";
import { toast } from "sonner";

interface UseScanOptions {
  activePallet: PalletWithCount | null;
  onSuccess: () => void;
}

export function useScan({ activePallet, onSuccess }: UseScanOptions) {
  const submitScan = useCallback(
    async (barcode: string) => {
      const cleaned = barcode.trim();
      if (!cleaned) return;

      if (!activePallet) {
        toast.error("No active pallet — create one first");
        return;
      }

      if (activePallet.itemCount >= activePallet.maxItems) {
        toast.warning("Pallet is full — start a new pallet");
        return;
      }

      try {
        const res = await fetch("/api/items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ barcode: cleaned, palletId: activePallet.id }),
        });

        const data = await res.json();

        if (res.status === 201) {
          toast.success(`Scanned: ${cleaned}`, { duration: 2000 });
          onSuccess();
          return;
        }

        if (res.status === 409) {
          if (data.error === "duplicate") {
            toast.error(`Duplicate! Already in ${data.existingPallet}`, { duration: 4000 });
          } else if (data.error === "pallet_full") {
            toast.warning("Pallet is full — start a new pallet");
          }
          return;
        }

        toast.error(data.error ?? "Scan failed");
      } catch {
        toast.error("Network error — check your connection");
      }
    },
    [activePallet, onSuccess]
  );

  return { submitScan };
}
