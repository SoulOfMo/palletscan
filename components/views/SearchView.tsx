"use client";
import { SearchBox } from "@/components/search/SearchBox";
import { StatCard } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import type { PalletWithCount } from "@/lib/db/schema";
import { toast } from "sonner";

interface SearchViewProps {
  pallets: PalletWithCount[];
  activePallet: PalletWithCount | null;
  onClearAll: () => void;
}

export function SearchView({ pallets, activePallet, onClearAll }: SearchViewProps) {
  const totalItems = pallets.reduce((s, p) => s + p.itemCount, 0);
  const fullPallets = pallets.filter((p) => p.itemCount >= p.maxItems).length;

  const handleClear = async () => {
    if (!confirm("Delete ALL pallets and items permanently? This cannot be undone.")) return;
    try {
      // Delete all pallets one by one (cascade deletes items)
      await Promise.all(pallets.map((p) => fetch(`/api/pallets/${p.id}`, { method: "DELETE" })));
      onClearAll();
      toast.success("All data cleared");
    } catch {
      toast.error("Failed to clear data");
    }
  };

  return (
    <div className="p-4 animate-fadeUp flex flex-col gap-5">
      <SearchBox />

      <div>
        <SectionLabel>Database Stats</SectionLabel>
        <div className="grid grid-cols-2 gap-2">
          <StatCard label="PALLETS" value={pallets.length} color="#00c060" />
          <StatCard label="TOTAL ITEMS" value={totalItems} color="#00ff88" />
          <StatCard label="FULL PALLETS" value={fullPallets} color="#ffaa00" />
          <StatCard
            label="ACTIVE PALLET"
            value={activePallet?.palletNumber ?? "—"}
            color="#555"
          />
        </div>
      </div>

      <Button variant="ghost" fullWidth onClick={handleClear}>
        CLEAR ALL DATA
      </Button>
    </div>
  );
}
