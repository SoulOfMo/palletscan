"use client";
import { useState, useEffect, useCallback } from "react";
import type { PalletWithCount } from "@/lib/db/schema";

export function usePallets() {
  const [pallets, setPallets] = useState<PalletWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPallets = useCallback(async () => {
    try {
      const res = await fetch("/api/pallets");
      if (!res.ok) throw new Error("Failed to load pallets");
      const data = await res.json();
      setPallets(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPallets();
  }, [fetchPallets]);

  const createPallet = useCallback(async (maxItems: number = 31) => {
    const res = await fetch("/api/pallets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ maxItems }),
    });
    if (!res.ok) throw new Error("Failed to create pallet");
    const pallet = await res.json();
    await fetchPallets();
    return pallet;
  }, [fetchPallets]);

  const deletePallet = useCallback(async (id: number) => {
    const res = await fetch(`/api/pallets/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete pallet");
    await fetchPallets();
  }, [fetchPallets]);

  return { pallets, loading, error, refetch: fetchPallets, createPallet, deletePallet };
}
