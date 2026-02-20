"use client";
import clsx from "clsx";

interface ProgressBarProps {
  value: number; // 0-100
  isFull?: boolean;
}

export function ProgressBar({ value, isFull }: ProgressBarProps) {
  return (
    <div className="h-1 bg-surface-muted rounded-full overflow-hidden">
      <div
        className={clsx(
          "h-full rounded-full transition-all duration-500",
          isFull
            ? "bg-gradient-to-r from-yellow-700 to-brand-yellow"
            : value > 80
            ? "bg-gradient-to-r from-green-900 to-brand-green"
            : "bg-gradient-to-r from-green-950 to-brand-green-dim"
        )}
        style={{ width: `${Math.min(100, value)}%` }}
      />
    </div>
  );
}
