"use client";
import { useState, useCallback, useEffect } from "react";
import { ActivePalletCard } from "@/components/pallets/ActivePalletCard";
import { NewPalletModal } from "@/components/pallets/NewPalletModal";
import { BarcodeScanner } from "@/components/scanner/BarcodeScanner";
import { ManualInput } from "@/components/scanner/ManualInput";
import { RecentScans } from "@/components/scanner/RecentScans";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { useScan } from "@/hooks/useScan";
import type { PalletWithCount, Item } from "@/lib/db/schema";

interface ScanViewProps {
  pallets: PalletWithCount[];
  activePallet: PalletWithCount | null;
  onCreatePallet: (maxItems: number) => Promise<PalletWithCount>;
  onPalletChange: () => void;
}

export function ScanView({
  pallets,
  activePallet,
  onCreatePallet,
  onPalletChange,
}: ScanViewProps) {
  const [showModal, setShowModal] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [recentItems, setRecentItems] = useState<Item[]>([]);

  const isFull = activePallet
    ? activePallet.itemCount >= activePallet.maxItems
    : false;
  const disabled = !activePallet || isFull;

  const fetchRecentItems = useCallback(async () => {
    if (!activePallet) { setRecentItems([]); return; }
    const res = await fetch(`/api/pallets/${activePallet.id}/items`);
    if (res.ok) setRecentItems(await res.json());
  }, [activePallet]);

  useEffect(() => {
    fetchRecentItems();
  }, [fetchRecentItems]);

  const handleSuccess = useCallback(() => {
    onPalletChange();
    fetchRecentItems();
  }, [onPalletChange, fetchRecentItems]);

  const { submitScan } = useScan({ activePallet, onSuccess: handleSuccess });

  const handleCreate = async (maxItems: number) => {
    await onCreatePallet(maxItems);
    setShowModal(false);
    setCameraOn(false);
  };

  return (
    <div className="p-4 flex flex-col gap-3 animate-fadeUp">
      <ActivePalletCard pallet={activePallet} />

      <Button variant="primary" fullWidth onClick={() => setShowModal(true)}>
        + NEW PALLET
      </Button>

      {/* Camera */}
      <div>
        <SectionLabel>Camera Scanner</SectionLabel>
        <Button
          variant={cameraOn ? "primary" : "secondary"}
          fullWidth
          disabled={disabled}
          onClick={() => setCameraOn((v) => !v)}
          className="mb-2"
        >
          {cameraOn ? "■ STOP SCANNER" : "▶ START CAMERA"}
        </Button>
        {cameraOn && <BarcodeScanner onScan={submitScan} active={cameraOn && !disabled} />}
      </div>

      <ManualInput onSubmit={submitScan} disabled={disabled} />

      <RecentScans items={recentItems} />

      {showModal && (
        <NewPalletModal
          nextNumber={pallets.length + 1}
          onConfirm={handleCreate}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
