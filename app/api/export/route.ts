export const dynamic = "force-dynamic";
export const revalidate = 0;

import {NextResponse} from "next/server";
import {generateExcelBuffer} from "@/lib/services/exportService";
import {format} from "date-fns";

export async function GET() {
  try {
    const buffer = await generateExcelBuffer();
    const filename = `PalletScan_${format(new Date(), "yyyy-MM-dd_HHmm")}.xlsx`;

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
