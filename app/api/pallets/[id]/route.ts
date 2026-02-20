import { NextResponse } from "next/server";
import { deletePallet, getPalletById } from "@/lib/services/palletService";

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    if (isNaN(id)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    const pallet = await getPalletById(id);
    if (!pallet) return NextResponse.json({ error: "Pallet not found" }, { status: 404 });

    await deletePallet(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/pallets/:id]", err);
    return NextResponse.json({ error: "Failed to delete pallet" }, { status: 500 });
  }
}

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    if (isNaN(id)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    const pallet = await getPalletById(id);
    if (!pallet) return NextResponse.json({ error: "Pallet not found" }, { status: 404 });

    return NextResponse.json(pallet);
  } catch (err) {
    console.error("[GET /api/pallets/:id]", err);
    return NextResponse.json({ error: "Failed to fetch pallet" }, { status: 500 });
  }
}
