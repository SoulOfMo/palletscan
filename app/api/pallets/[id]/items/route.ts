import { NextResponse } from "next/server";
import { getItemsByPallet } from "@/lib/services/itemService";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    if (isNaN(id)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    const items = await getItemsByPallet(id);
    return NextResponse.json(items);
  } catch (err) {
    console.error("[GET /api/pallets/:id/items]", err);
    return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 });
  }
}
