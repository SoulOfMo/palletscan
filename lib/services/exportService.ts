import * as XLSX from "xlsx";
import { getAllPallets } from "./palletService";
import { getItemsByPallet } from "./itemService";
import { format } from "date-fns";

export async function generateExcelBuffer(): Promise<Buffer> {
  const pallets = await getAllPallets();

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
