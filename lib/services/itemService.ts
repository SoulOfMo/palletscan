import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { items, pallets, type Item, type ItemWithPallet } from "@/lib/db/schema";
import { getPalletById, getPalletItemCount } from "./palletService";

export type AddItemResult =
  | { success: true; item: Item }
  | { success: false; error: "duplicate"; existingPallet: string }
  | { success: false; error: "pallet_full" }
  | { success: false; error: "pallet_not_found" }
  | { success: false; error: "invalid_barcode" };

export async function addItem(
  barcode: string,
  palletId: number
): Promise<AddItemResult> {
  const cleaned = barcode.trim();
  if (!cleaned) return { success: false, error: "invalid_barcode" };

  // 1. Check global barcode uniqueness
  const [existing] = await db
    .select({ id: items.id, palletId: items.palletId })
    .from(items)
    .where(eq(items.barcode, cleaned));

  if (existing) {
    const [pallet] = await db
      .select({ palletNumber: pallets.palletNumber })
      .from(pallets)
      .where(eq(pallets.id, existing.palletId));
    return {
      success: false,
      error: "duplicate",
      existingPallet: pallet?.palletNumber ?? "Unknown",
    };
  }

  // 2. Verify pallet exists
  const pallet = await getPalletById(palletId);
  if (!pallet) return { success: false, error: "pallet_not_found" };

  // 3. Check pallet capacity
  const currentCount = await getPalletItemCount(palletId);
  if (currentCount >= pallet.maxItems) return { success: false, error: "pallet_full" };

  // 4. Insert — DB unique constraint is final safety net
  try {
    const [item] = await db
      .insert(items)
      .values({ barcode: cleaned, palletId })
      .returning();
    return { success: true, item };
  } catch (err: unknown) {
    // Catch DB-level unique violation (race condition safety)
    if (
      err instanceof Error &&
      err.message.includes("unique") || 
      (err as { code?: string }).code === "23505"
    ) {
      return { success: false, error: "duplicate", existingPallet: "Unknown" };
    }
    throw err;
  }
}

export async function searchBarcode(barcode: string): Promise<ItemWithPallet | null> {
  const cleaned = barcode.trim();
  if (!cleaned) return null;

  const [row] = await db
    .select({
      id: items.id,
      barcode: items.barcode,
      palletId: items.palletId,
      scannedAt: items.scannedAt,
      palletNumber: pallets.palletNumber,
    })
    .from(items)
    .innerJoin(pallets, eq(pallets.id, items.palletId))
    .where(eq(items.barcode, cleaned));

  return row ?? null;
}

export async function getItemsByPallet(palletId: number): Promise<Item[]> {
  return db
    .select()
    .from(items)
    .where(eq(items.palletId, palletId))
    .orderBy(items.scannedAt);
}

export async function getAllItemsWithPallet(): Promise<ItemWithPallet[]> {
  return db
    .select({
      id: items.id,
      barcode: items.barcode,
      palletId: items.palletId,
      scannedAt: items.scannedAt,
      palletNumber: pallets.palletNumber,
    })
    .from(items)
    .innerJoin(pallets, eq(pallets.id, items.palletId))
    .orderBy(pallets.id, items.scannedAt);
}
