import type { Item } from "@/lib/db/schema";
import { format } from "date-fns";
import { SectionLabel } from "@/components/ui/SectionLabel";

interface RecentScansProps {
  items: Item[];
}

export function RecentScans({ items }: RecentScansProps) {
  if (items.length === 0) return null;

  const recent = [...items].reverse().slice(0, 10);

  return (
    <div>
      <SectionLabel>
        Recent Scans — {items.length} item{items.length !== 1 ? "s" : ""}
      </SectionLabel>
      <div className="flex flex-col gap-1">
        {recent.map((item, idx) => (
          <div
            key={item.id}
            className="flex justify-between items-center px-3 py-2 rounded-md border font-mono"
            style={{
              background: idx === 0 ? "#001a0d" : "#0a0a12",
              borderColor: idx === 0 ? "#003a18" : "#111",
              animation: idx === 0 ? "fadeUp 0.3s ease" : "none",
            }}
          >
            <span
              className="text-sm truncate max-w-[65%]"
              style={{ color: idx === 0 ? "#00ff88" : "#666" }}
            >
              {item.barcode}
            </span>
            <span className="text-[10px] text-gray-700 whitespace-nowrap">
              {format(new Date(item.scannedAt), "HH:mm:ss")}
            </span>
          </div>
        ))}
        {items.length > 10 && (
          <p className="text-center text-[10px] text-gray-700 py-1.5 tracking-widest">
            +{items.length - 10} more — view in Pallets tab
          </p>
        )}
      </div>
    </div>
  );
}
