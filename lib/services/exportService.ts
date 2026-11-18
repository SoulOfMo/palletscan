import * as XLSX from "xlsx";
import { getAllPallets, getPalletById } from "./palletService";
import { getItemsByPallet } from "./itemService";
import { format } from "date-fns";
import type { PalletWithCount } from "@/lib/db/schema";

export async function generateExcelBuffer(palletId?: number): Promise<Buffer> {
  let pallets: PalletWithCount[];

  if (palletId !== undefined) {
    const pallet = await getPalletById(palletId);
    if (!pallet) {
      throw new Error("Pallet not found");
    }
    pallets = [{ ...pallet, itemCount: 0 }];
  } else {
    pallets = await getAllPallets();
  }

  if (pallets.length === 0) {
    throw new Error("No pallets to export");
  }

  const wb = XLSX.utils.book_new();

  for (const pallet of pallets) {
    const palletItems = await getItemsByPallet(pallet.id);

    const rows = [
      ["Barcode", "Scanned At"],
      ...palletItems.map((item) => [
        item.barcode,
        format(new Date(item.scannedAt), "yyyy-MM-dd HH:mm:ss"),
      ]),
    ];

    const ws = XLSX.utils.aoa_to_sheet(rows);

    // Column widths
    ws["!cols"] = [{ wch: 35 }, { wch: 22 }];

    // Header style
    ws["A1"].s = { font: { bold: true }, fill: { fgColor: { rgb: "003018" } } };
    ws["B1"].s = { font: { bold: true } };

    const sheetName = pallet.palletNumber
      .replace(/[\\/?*[\]:]/g, "_")
      .slice(0, 31);
    XLSX.utils.book_append_sheet(wb, ws, sheetName || `Pallet_${pallet.id}`);
  }

  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
  return buf;
}
