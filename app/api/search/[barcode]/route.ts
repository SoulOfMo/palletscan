import { NextResponse } from "next/server";
import { searchBarcode } from "@/lib/services/itemService";

export async function GET(
  _req: Request,
  { params }: { params: { barcode: string } }
) {
  try {
    const barcode = decodeURIComponent(params.barcode).trim();
    if (!barcode) {
      return NextResponse.json({ error: "Barcode is required" }, { status: 400 });
    }

    const result = await searchBarcode(barcode);

    if (!result) {
      return NextResponse.json({ found: false }, { status: 200 });
    }

    return NextResponse.json({ found: true, ...result });
  } catch (err) {
    console.error("[GET /api/search/:barcode]", err);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
