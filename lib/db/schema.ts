import { pgTable, serial, varchar, integer, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ─── PALLETS ────────────────────────────────────────────────
export const pallets = pgTable("pallets", {
  id: serial("id").primaryKey(),
  palletNumber: varchar("pallet_number", { length: 64 }).notNull().unique(),
  maxItems: integer("max_items").notNull().default(31),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── ITEMS ──────────────────────────────────────────────────
export const items = pgTable(
  "items",
  {
    id: serial("id").primaryKey(),
    barcode: varchar("barcode", { length: 255 }).notNull(),
    palletId: integer("pallet_id")
      .notNull()
      .references(() => pallets.id, { onDelete: "cascade" }),
    scannedAt: timestamp("scanned_at").defaultNow().notNull(),
  },
  (table) => ({
    barcodeUnique: uniqueIndex("items_barcode_unique").on(table.barcode),
  })
);

// ─── RELATIONS ───────────────────────────────────────────────
export const palletsRelations = relations(pallets, ({ many }) => ({
  items: many(items),
}));

export const itemsRelations = relations(items, ({ one }) => ({
  pallet: one(pallets, {
    fields: [items.palletId],
    references: [pallets.id],
  }),
}));

// ─── TYPES ──────────────────────────────────────────────────
export type Pallet = typeof pallets.$inferSelect;
export type NewPallet = typeof pallets.$inferInsert;
export type Item = typeof items.$inferSelect;
export type NewItem = typeof items.$inferInsert;

export type PalletWithCount = Pallet & { itemCount: number };
export type ItemWithPallet = Item & { palletNumber: string };
