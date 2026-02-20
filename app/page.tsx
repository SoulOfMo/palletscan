"use client";
import { useState, useCallback } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { ScanView } from "@/components/views/ScanView";
import { PalletsView } from "@/components/views/PalletsView";
import { SearchView } from "@/components/views/SearchView";
import { usePallets } from "@/hooks/usePallets";
import type { PalletWithCount } from "@/lib/db/schema";
import { toast } from "sonner";

type Tab = "scan" | "pallets" | "search";

export default function Home() {
  const [tab, setTab] = useState<Tab>("scan");
  const [activePallet, setActivePallet] = useState<PalletWithCount | null>(null);

  const { pallets, loading, error, refetch, createPallet, deletePallet } = usePallets();

  // Set active pallet to last non-full pallet when data loads
  const handleRefetch = useCallback(async () => {
    await refetch();
  }, [refetch]);

  // Auto-select active pallet after creating
  const handleCreatePallet = useCallback(
    async (maxItems: number) => {
      const newPallet = await createPallet(maxItems);
      setActivePallet({ ...newPallet, itemCount: 0 });
      await refetch();
      return newPallet;
    },
    [createPallet, refetch]
  );

  const handleSetActive = useCallback((pallet: PalletWithCount) => {
    setActivePallet(pallet);
    setTab("scan");
    toast.success(`Switched to ${pallet.palletNumber}`);
  }, []);

  const handleDelete = useCallback(
    async (id: number) => {
      if (activePallet?.id === id) setActivePallet(null);
      await deletePallet(id);
      toast.success("Pallet deleted");
    },
    [activePallet, deletePallet]
  );

  const handleClearAll = useCallback(async () => {
    setActivePallet(null);
    await refetch();
  }, [refetch]);

  // Sync active pallet count when items are added
  const handlePalletChange = useCallback(async () => {
    await refetch();
    // Re-sync activePallet with updated count from server
    if (activePallet) {
      const res = await fetch(`/api/pallets/${activePallet.id}`);
      if (res.ok) {
        const updated = await res.json();
        const cnt = await fetch(`/api/pallets/${activePallet.id}/items`);
        const items = cnt.ok ? await cnt.json() : [];
        setActivePallet({ ...updated, itemCount: items.length });
      }
    }
  }, [activePallet, refetch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <p className="font-display text-2xl font-extrabold text-white">
            PALLET<span className="text-brand-green-dim">SCAN</span>
          </p>
          <p className="text-xs text-gray-700 tracking-widest mt-2 animate-pulse2">
            CONNECTING TO DATABASE...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-6">
        <div className="text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="font-display text-lg font-bold text-white mb-2">Database Error</p>
          <p className="text-xs text-red-500 font-mono mb-4">{error}</p>
          <p className="text-xs text-gray-600">Check your DATABASE_URL in .env.local</p>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-[480px] mx-auto min-h-screen">
      <AppHeader activeTab={tab} onTabChange={setTab} />

      {tab === "scan" && (
        <ScanView
          pallets={pallets}
          activePallet={activePallet}
          onCreatePallet={handleCreatePallet}
          onPalletChange={handlePalletChange}
        />
      )}
      {tab === "pallets" && (
        <PalletsView
          pallets={pallets}
          activePallet={activePallet}
          onSetActive={handleSetActive}
          onDelete={handleDelete}
        />
      )}
      {tab === "search" && (
        <SearchView
          pallets={pallets}
          activePallet={activePallet}
          onClearAll={handleClearAll}
        />
      )}
    </main>
  );
}
