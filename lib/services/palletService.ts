import { eq, sql, count } from "drizzle-orm";
import { db } from "@/lib/db";
import { pallets, items, type Pallet, type PalletWithCount } from "@/lib/db/schema";

export async function getAllPallets(): Promise<PalletWithCount[]> {
  const rows = await db
    .select({
      id: pallets.id,
      palletNumber: pallets.palletNumber,
      maxItems: pallets.maxItems,
      createdAt: pallets.createdAt,
      itemCount: count(items.id),
    })
    .from(pallets)
    .leftJoin(items, eq(items.palletId, pallets.id))
    .groupBy(pallets.id)
    .orderBy(pallets.id);

  return rows.map((r) => ({ ...r, itemCount: Number(r.itemCount) }));
}

export async function getPalletById(id: number): Promise<Pallet | null> {
  const [pallet] = await db.select().from(pallets).where(eq(pallets.id, id));
  return pallet ?? null;
}

export async function createPallet(maxItems: number = 31): Promise<Pallet> {
  // Auto-generate pallet number
  const [{ nextNum }] = await db
    .select({ nextNum: sql<number>`coalesce(max(id), 0) + 1` })
    .from(pallets);

  const palletNumber = `Pallet_${nextNum}`;

  const [pallet] = await db
    .insert(pallets)
    .values({ palletNumber, maxItems })
    .returning();

  return pallet;
}

export async function deletePallet(id: number): Promise<void> {
  await db.delete(pallets).where(eq(pallets.id, id));
}

export async function getPalletItemCount(palletId: number): Promise<number> {
  const [{ cnt }] = await db
    .select({ cnt: count(items.id) })
    .from(items)
    .where(eq(items.palletId, palletId));
  return Number(cnt);
}
