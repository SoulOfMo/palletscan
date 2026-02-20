import { NextResponse } from "next/server";
import { addItem } from "@/lib/services/itemService";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { barcode, palletId } = body;

    if (!barcode || typeof barcode !== "string") {
      return NextResponse.json({ error: "barcode is required" }, { status: 400 });
    }
    if (!palletId || typeof palletId !== "number") {
      return NextResponse.json({ error: "palletId is required" }, { status: 400 });
    }

    const result = await addItem(barcode, palletId);

    if (result.success) {
      return NextResponse.json(result.item, { status: 201 });
    }

    switch (result.error) {
      case "duplicate":
        return NextResponse.json(
          { error: "duplicate", existingPallet: result.existingPallet },
          { status: 409 }
        );
      case "pallet_full":
        return NextResponse.json({ error: "pallet_full" }, { status: 409 });
      case "pallet_not_found":
        return NextResponse.json({ error: "Pallet not found" }, { status: 404 });
      case "invalid_barcode":
        return NextResponse.json({ error: "Invalid barcode" }, { status: 400 });
    }
  } catch (err) {
    console.error("[POST /api/items]", err);
    return NextResponse.json({ error: "Failed to add item" }, { status: 500 });
  }
}
