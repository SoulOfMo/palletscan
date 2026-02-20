"use client";
import { toast } from "sonner";

type Tab = "scan" | "pallets" | "search";

interface AppHeaderProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const tabs: [Tab, string][] = [
  ["scan", "⬛ SCAN"],
  ["pallets", "📦 PALLETS"],
  ["search", "🔍 SEARCH"],
];

async function handleExport() {
  try {
    const res = await fetch("/api/export");
    if (!res.ok) {
      const d = await res.json();
      toast.error(d.error ?? "Export failed");
      return;
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `PalletScan_${new Date().toISOString().slice(0, 10)}.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Excel file downloaded!");
  } catch {
    toast.error("Export failed");
  }
}

export function AppHeader({ activeTab, onTabChange }: AppHeaderProps) {
  return (
    <div className="sticky top-0 bg-surface z-50 border-b border-[#0d0d18] px-4 pt-5 pb-0">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-white tracking-tight leading-none">
            PALLET<span className="text-brand-green-dim">SCAN</span>
          </h1>
          <p className="text-[9px] text-gray-700 tracking-[3px] mt-1">
            WAREHOUSE BARCODE SYSTEM
          </p>
        </div>
        <button
          onClick={handleExport}
          className="px-3 py-2 bg-[#0a1a0f] border border-[#1a4a2f] text-brand-green-dim rounded-lg text-[11px] tracking-widest font-mono transition-all hover:brightness-125 cursor-pointer"
        >
          ↓ XLSX
        </button>
      </div>

      <div className="flex">
        {tabs.map(([id, label]) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className="flex-1 py-2.5 text-[10px] tracking-[2px] font-mono border-b-2 transition-all cursor-pointer bg-transparent"
            style={{
              color: activeTab === id ? "#00ff88" : "#444",
              borderBottomColor: activeTab === id ? "#00ff88" : "transparent",
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
