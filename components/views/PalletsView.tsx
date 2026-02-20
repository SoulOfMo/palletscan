"use client";
import { PalletCard } from "@/components/pallets/PalletCard";
import { Button } from "@/components/ui/Button";
import type { PalletWithCount } from "@/lib/db/schema";
import { toast } from "sonner";

interface PalletsViewProps {
  pallets: PalletWithCount[];
  activePallet: PalletWithCount | null;
  onSetActive: (pallet: PalletWithCount) => void;
  onDelete: (id: number) => void;
}

async function handleExport() {
  try {
    const res = await fetch("/api/export");
    if (!res.ok) { toast.error("Export failed"); return; }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `PalletScan_${new Date().toISOString().slice(0,10)}.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Excel downloaded!");
  } catch {
    toast.error("Export failed");
  }
}

export function PalletsView({ pallets, activePallet, onSetActive, onDelete }: PalletsViewProps) {
  const totalItems = pallets.reduce((s, p) => s + p.itemCount, 0);

  return (
    <div className="p-4 animate-fadeUp">
      <div className="flex justify-between items-center mb-4">
        <p className="text-[9px] text-gray-600 tracking-[2.5px]">
          {pallets.length} PALLET{pallets.length !== 1 ? "S" : ""} — {totalItems} TOTAL ITEMS
        </p>
        <Button variant="primary" onClick={handleExport} className="!py-2 !px-3 !text-[10px]">
          EXPORT ↓
        </Button>
      </div>

      {pallets.length === 0 ? (
        <div className="text-center py-16 text-gray-700">
          <div className="text-5xl mb-4">📦</div>
          <p className="text-xs tracking-widest">NO PALLETS YET</p>
          <p className="text-[10px] mt-2 text-gray-800">Go to Scan tab to create one</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {[...pallets].reverse().map((pallet) => (
            <PalletCard
              key={pallet.id}
              pallet={pallet}
              isActive={activePallet?.id === pallet.id}
              onSetActive={onSetActive}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
