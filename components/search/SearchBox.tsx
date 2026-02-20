"use client";
import { useState } from "react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { format } from "date-fns";
import type { ItemWithPallet } from "@/lib/db/schema";

export function SearchBox() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<{ found: boolean } & Partial<ItemWithPallet> | null>(null);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/search/${encodeURIComponent(query.trim())}`);
      const data = await res.json();
      setResult(data);
    } catch {
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <SectionLabel>Barcode Lookup</SectionLabel>
      <div className="flex gap-2 mb-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && search()}
          placeholder="Search any barcode..."
          className="flex-1 px-4 py-3 bg-surface-card border border-surface-border rounded-lg text-sm text-gray-200 placeholder-gray-700 outline-none focus:border-gray-500 font-mono"
        />
        <button
          onClick={search}
          disabled={loading}
          className="px-5 py-3 bg-brand-green-dark border border-brand-green-dim text-brand-green rounded-lg text-xl transition-all active:scale-95 cursor-pointer disabled:opacity-50"
        >
          {loading ? "…" : "↵"}
        </button>
      </div>

      {result && (
        <div
          className="p-5 rounded-xl border animate-fadeUp"
          style={{
            background: result.found ? "#001a0d" : "#1a0005",
            borderColor: result.found ? "#00c060" : "#c00030",
          }}
        >
          {result.found ? (
            <>
              <p className="text-[10px] text-brand-green-dim tracking-[2.5px] mb-4">
                ✓ FOUND IN DATABASE
              </p>
              <div className="grid grid-cols-[90px_1fr] gap-y-2.5 gap-x-3">
                {[
                  ["BARCODE", result.barcode, "#00ff88"],
                  ["PALLET", result.palletNumber, "#fff"],
                  ["SCANNED", result.scannedAt ? format(new Date(result.scannedAt), "MMM d, yyyy · HH:mm:ss") : "—", "#888"],
                ].map(([label, val, color]) => (
                  <>
                    <span key={label + "l"} className="text-[9px] text-gray-600 tracking-[2px] self-center">
                      {label}
                    </span>
                    <span key={label + "v"} className="text-sm font-mono break-all" style={{ color: color as string }}>
                      {val}
                    </span>
                  </>
                ))}
              </div>
            </>
          ) : (
            <>
              <p className="text-[10px] text-red-700 tracking-[2.5px] mb-2">✕ NOT FOUND</p>
              <p className="text-xs text-gray-600">
                &quot;{query}&quot; does not exist in any pallet.
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
