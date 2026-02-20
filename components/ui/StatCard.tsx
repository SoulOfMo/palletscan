interface StatCardProps {
  label: string;
  value: string | number;
  color?: string;
}

export function StatCard({ label, value, color = "#00c060" }: StatCardProps) {
  return (
    <div className="bg-surface-card border border-surface-border rounded-xl p-4">
      <div className="font-display text-2xl font-bold leading-none" style={{ color }}>
        {value}
      </div>
      <div className="text-[9px] text-gray-600 tracking-[2px] mt-1.5">{label}</div>
    </div>
  );
}
