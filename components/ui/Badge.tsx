import clsx from "clsx";

type BadgeVariant = "green" | "yellow" | "red" | "gray";

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
}

const variants: Record<BadgeVariant, string> = {
  green: "bg-brand-green-dark border border-brand-green-dim text-brand-green-dim",
  yellow: "bg-brand-yellow-dark border border-yellow-600 text-brand-yellow",
  red: "bg-brand-red-dark border border-red-800 text-brand-red",
  gray: "bg-surface-card border border-surface-border text-gray-500",
};

export function Badge({ label, variant = "gray" }: BadgeProps) {
  return (
    <span
      className={clsx(
        "text-[8px] px-2 py-0.5 rounded-full tracking-widest font-mono",
        variants[variant]
      )}
    >
      {label}
    </span>
  );
}
