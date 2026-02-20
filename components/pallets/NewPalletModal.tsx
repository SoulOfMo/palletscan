"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import clsx from "clsx";

const PRESETS = [20, 25, 31, 33, 40, 50];

interface NewPalletModalProps {
  nextNumber: number;
  onConfirm: (maxItems: number) => void;
  onClose: () => void;
}

export function NewPalletModal({ nextNumber, onConfirm, onClose }: NewPalletModalProps) {
  const [size, setSize] = useState(31);

  return (
    <div
      className="fixed inset-0 bg-black/88 flex items-end z-50"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[480px] mx-auto bg-[#0d0d18] border border-surface-border rounded-t-2xl p-6 animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-display text-xl font-extrabold text-white mb-1">New Pallet</h2>
        <p className="text-xs text-gray-600 mb-5">
          Will be created as:{" "}
          <span className="text-brand-green">Pallet_{nextNumber}</span>
        </p>

        <p className="text-[9px] text-gray-600 tracking-[2.5px] mb-2">MAX ITEMS PER PALLET</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {PRESETS.map((n) => (
            <button
              key={n}
              onClick={() => setSize(n)}
              className={clsx(
                "px-4 py-2 rounded-lg text-sm font-mono transition-all cursor-pointer border",
                size === n
                  ? "bg-brand-green-dark border-brand-green-dim text-brand-green"
                  : "bg-surface-muted border-[#222] text-gray-600 hover:border-gray-600"
              )}
            >
              {n}
            </button>
          ))}
        </div>
        <input
          type="number"
          value={size}
          min={1}
          max={9999}
          onChange={(e) => setSize(Math.max(1, parseInt(e.target.value) || 31))}
          className="w-full px-4 py-3 bg-surface-card border border-surface-border rounded-lg text-white text-base font-mono outline-none focus:border-gray-500 mb-5"
          placeholder="Custom size..."
        />

        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={onClose}>
            CANCEL
          </Button>
          <Button
            variant="primary"
            className="flex-[2]"
            onClick={() => onConfirm(size)}
          >
            CREATE PALLET
          </Button>
        </div>
      </div>
    </div>
  );
}
