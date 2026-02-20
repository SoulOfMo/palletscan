import { ProgressBar } from "@/components/ui/ProgressBar";
import type { PalletWithCount } from "@/lib/db/schema";

interface ActivePalletCardProps {
  pallet: PalletWithCount | null;
}

export function ActivePalletCard({ pallet }: ActivePalletCardProps) {
  if (!pallet) {
    return (
      <div className="bg-surface-card border border-dashed border-surface-border rounded-xl p-7 text-center">
        <div className="text-4xl mb-2">📦</div>
        <div className="text-xs text-gray-600">No active pallet</div>
        <div className="text-[10px] text-gray-700 mt-1 tracking-widest">
          CREATE ONE BELOW TO START SCANNING
        </div>
      </div>
    );
  }

  const isFull = pallet.itemCount >= pallet.maxItems;
  const pct = Math.min(100, Math.round((pallet.itemCount / pallet.maxItems) * 100));

  return (
    <div className="bg-surface-card border border-surface-border rounded-xl p-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="text-[9px] text-gray-600 tracking-[2.5px] mb-1">ACTIVE PALLET</p>
          <h2 className="font-display text-2xl font-extrabold text-white leading-none">
            {pallet.palletNumber}
          </h2>
        </div>
        <div className="text-right">
          <span
            className="font-display text-3xl font-light leading-none"
            style={{ color: isFull ? "#ffaa00" : "#00ff88" }}
          >
            {pallet.itemCount}
          </span>
          <span className="text-sm text-gray-700">/{pallet.maxItems}</span>
          <p className="text-[9px] text-gray-600 tracking-widest mt-1">ITEMS</p>
        </div>
      </div>

      <ProgressBar value={pct} isFull={isFull} />

      {isFull && (
        <div className="mt-3 px-3 py-2 bg-brand-yellow-dark border border-yellow-800 rounded-lg text-xs text-brand-yellow animate-pulse2 tracking-wide">
          ⚠ PALLET FULL — Create a new pallet to continue scanning
        </div>
      )}
    </div>
  );
}
