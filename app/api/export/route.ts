export const dynamic = "force-dynamic";
export const revalidate = 0;

import {NextResponse} from "next/server";
import {generateExcelBuffer} from "@/lib/services/exportService";
import {getPalletById} from "@/lib/services/palletService";
import {format} from "date-fns";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const palletIdParam = url.searchParams.get("palletId");
    let palletId: number | undefined;

    if (palletIdParam !== null) {
      palletId = Number(palletIdParam);
      if (!Number.isInteger(palletId) || palletId < 1) {
        return NextResponse.json({ error: "Invalid pallet ID" }, { status: 400 });
      }
      const pallet = await getPalletById(palletId);
      if (!pallet) {
        return NextResponse.json({ error: "Pallet not found" }, { status: 404 });
      }
    }

    const buffer = await generateExcelBuffer(palletId);
    const filename = palletId
      ? `Pallet_${palletId}_${format(new Date(), "yyyy-MM-dd_HHmm")}.xlsx`
      : `PalletScan_${format(new Date(), "yyyy-MM-dd_HHmm")}.xlsx`;

    // Preserve exactly the bytes produced by XLSX, including Buffer offsets.
    const arrayBuffer = buffer.buffer.slice(
      buffer.byteOffset,
      buffer.byteOffset + buffer.byteLength
    ) as ArrayBuffer;

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (err: unknown) {
    console.error("[GET /api/export]", err);
    const message = err instanceof Error ? err.message : "Export failed";
    return NextResponse.json({error: message}, {status: 500});
  }
}
