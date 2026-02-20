import { NextResponse } from "next/server";
import { generateExcelBuffer } from "@/lib/services/exportService";
import { format } from "date-fns";

export async function GET() {
  try {
    const buffer = await generateExcelBuffer();
    const filename = `PalletScan_${format(new Date(), "yyyy-MM-dd_HHmm")}.xlsx`;

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": buffer.length.toString(),
      },
    });
  } catch (err: unknown) {
    console.error("[GET /api/export]", err);
    const message = err instanceof Error ? err.message : "Export failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
