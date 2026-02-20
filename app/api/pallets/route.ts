import { NextResponse } from "next/server";
import { getAllPallets, createPallet } from "@/lib/services/palletService";

export async function GET() {
  try {
    const pallets = await getAllPallets();
    return NextResponse.json(pallets);
  } catch (err) {
    console.error("[GET /api/pallets]", err);
    return NextResponse.json({ error: "Failed to fetch pallets" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const maxItems = Number(body.maxItems) || 31;

    if (maxItems < 1 || maxItems > 9999) {
      return NextResponse.json(
        { error: "maxItems must be between 1 and 9999" },
        { status: 400 }
      );
    }

    const pallet = await createPallet(maxItems);
    return NextResponse.json(pallet, { status: 201 });
  } catch (err) {
    console.error("[POST /api/pallets]", err);
    return NextResponse.json({ error: "Failed to create pallet" }, { status: 500 });
  }
}
