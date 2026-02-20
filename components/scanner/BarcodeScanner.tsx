"use client";
import { useScanner } from "@/hooks/useScanner";

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
  active: boolean;
}

export function BarcodeScanner({ onScan, active }: BarcodeScannerProps) {
  const { videoRef, state, errorMsg } = useScanner(onScan, active);

  return (
    <div className="relative bg-black rounded-lg overflow-hidden border-2 border-surface-border min-h-[180px] flex items-center justify-center">
      <video
        ref={videoRef}
        className="w-full block max-h-[260px] object-cover"
        muted
        playsInline
      />

      {state === "scanning" && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[55%] h-0.5 bg-gradient-to-r from-transparent via-brand-green to-transparent animate-scanline shadow-[0_0_12px_#00ff88]" />
          <span className="absolute bottom-3 text-[9px] text-brand-green/60 tracking-[3px]">
            SCANNING
          </span>
        </div>
      )}

      {(state === "idle" || state === "loading" || state === "error") && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center px-4">
          <span className="text-4xl">📷</span>
          <span className="text-xs text-gray-600 tracking-wide">
            {state === "loading"
              ? "Initializing camera..."
              : state === "error"
              ? errorMsg
              : "Camera off"}
          </span>
        </div>
      )}
    </div>
  );
}
