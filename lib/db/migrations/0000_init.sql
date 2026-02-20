-- PalletScan initial schema
-- Run this manually or via: npm run db:push

CREATE TABLE IF NOT EXISTS "pallets" (
  "id" serial PRIMARY KEY,
  "pallet_number" varchar(64) NOT NULL UNIQUE,
  "max_items" integer NOT NULL DEFAULT 31,
  "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "items" (
  "id" serial PRIMARY KEY,
  "barcode" varchar(255) NOT NULL,
  "pallet_id" integer NOT NULL REFERENCES "pallets"("id") ON DELETE CASCADE,
  "scanned_at" timestamp DEFAULT now() NOT NULL
);

-- Global barcode uniqueness — enforced at the database level
CREATE UNIQUE INDEX IF NOT EXISTS "items_barcode_unique" ON "items"("barcode");
