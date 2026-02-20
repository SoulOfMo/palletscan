"use client";
import { useState } from "react";
import { SectionLabel } from "@/components/ui/SectionLabel";

interface ManualInputProps {
  onSubmit: (barcode: string) => void;
  disabled?: boolean;
}

export function ManualInput({ onSubmit, disabled }: ManualInputProps) {
  const [value, setValue] = useState("");

  const submit = () => {
    if (!value.trim()) return;
    onSubmit(value.trim());
    setValue("");
  };

  return (
    <div>
      <SectionLabel>Manual Input</SectionLabel>
      <div className="flex gap-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Type or paste barcode..."
          disabled={disabled}
          className="flex-1 px-4 py-3 bg-surface-card border border-surface-border rounded-lg text-sm text-gray-200 placeholder-gray-700 outline-none focus:border-gray-500 disabled:opacity-30 font-mono"
        />
        <button
          onClick={submit}
          disabled={disabled}
          className="px-5 py-3 bg-brand-green-dark border border-brand-green-dim text-brand-green rounded-lg text-xl transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          ↵
        </button>
      </div>
    </div>
  );
}
