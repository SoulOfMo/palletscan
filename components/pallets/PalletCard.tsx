"use client";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { Item, PalletWithCount } from "@/lib/db/schema";
import { format } from "date-fns";

interface PalletCardProps {
  pallet: PalletWithCount;
  isActive: boolean;
  onSetActive: (pallet: PalletWithCount) => void;
  onDelete: (id: number) => void;
}

export function PalletCard({ pallet, isActive, onSetActive, onDelete }: PalletCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [palletItems, setPalletItems] = useState<Item[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);

  const isFull = pallet.itemCount >= pallet.maxItems;
  const pct = Math.min(100, Math.round((pallet.itemCount / pallet.maxItems) * 100));

  useEffect(() => {
    if (expanded && palletItems.length === 0) {
      loadItems();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded]);

  async function loadItems() {
    setLoadingItems(true);
    try {
      const res = await fetch(`/api/pallets/${pallet.id}/items`);
      if (res.ok) setPalletItems(await res.json());
    } finally {
      setLoadingItems(false);
    }
  }

  return (
    <div className="bg-surface-card border border-surface-border rounded-xl overflow-hidden"
      style={{ borderColor: isActive ? "#003a18" : undefined }}
    >
      {/* Header row */}
      <div
        className="p-4 cursor-pointer"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="font-display text-lg font-bold text-white">
                {pallet.palletNumber}
              </span>
              {isActive && <Badge label="ACTIVE" variant="green" />}
              {isFull && <Badge label="FULL" variant="yellow" />}
            </div>
            <span className="text-[10px] text-gray-600 tracking-widest">
              {format(new Date(pallet.createdAt), "MMM d, yyyy · HH:mm")}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span
                className="font-display text-xl font-light"
                style={{ color: isFull ? "#ffaa00" : "#00ff88" }}
              >
                {pallet.itemCount}
              </span>
              <span className="text-xs text-gray-700">/{pallet.maxItems}</span>
            </div>
            <span className="text-gray-600 text-xs">{expanded ? "▲" : "▼"}</span>
          </div>
        </div>

        <div className="mt-3">
          <ProgressBar value={pct} isFull={isFull} />
        </div>
      </div>

      {/* Expanded items */}
      {expanded && (
        <div className="border-t border-surface-muted animate-fadeUp">
          <div className="max-h-64 overflow-y-auto">
            {loadingItems ? (
              <div className="p-4 text-center text-xs text-gray-600 tracking-widest">
                LOADING...
              </div>
            ) : palletItems.length === 0 ? (
              <div className="p-4 text-center text-xs text-gray-700 tracking-widest">
                NO ITEMS SCANNED
              </div>
            ) : (
              palletItems.map((item, idx) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center px-4 py-2 border-b border-[#0d0d18]"
                  style={{ background: idx % 2 === 0 ? "transparent" : "#070710" }}
                >
                  <span className="text-xs text-gray-500 font-mono">
                    <span className="text-gray-700 mr-2 w-6 inline-block">{idx + 1}.</span>
                    {item.barcode}
                  </span>
                  <span className="text-[10px] text-gray-700 whitespace-nowrap ml-2">
                    {format(new Date(item.scannedAt), "HH:mm:ss")}
                  </span>
                </div>
              ))
            )}
          </div>

          <div className="flex gap-2 p-3">
            {!isActive && !isFull && (
              <Button
                variant="primary"
                className="flex-1"
                onClick={() => onSetActive(pallet)}
              >
                SET ACTIVE
              </Button>
            )}
            <Button
              variant="danger"
              onClick={() => {
                if (confirm(`Delete ${pallet.palletNumber} and ALL its items?`)) {
                  onDelete(pallet.id);
                }
              }}
            >
              DELETE
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
