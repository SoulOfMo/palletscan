import clsx from "clsx";
import { type ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-br from-brand-green-dark to-[#003020] border border-brand-green-dim text-brand-green hover:brightness-125",
  secondary:
    "bg-surface-card border border-surface-border text-gray-400 hover:border-gray-500 hover:text-gray-300",
  danger:
    "bg-brand-red-dark border border-red-900 text-red-700 hover:border-red-700 hover:text-brand-red",
  ghost:
    "bg-transparent border border-[#1a0a0a] text-[#3a1a1a] hover:border-red-900 hover:text-red-800",
};

export function Button({
  variant = "secondary",
  fullWidth,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled}
      className={clsx(
        "font-mono text-xs tracking-widest px-4 py-3 rounded-lg transition-all active:scale-[0.97] cursor-pointer",
        variants[variant],
        fullWidth && "w-full",
        disabled && "opacity-30 cursor-not-allowed pointer-events-none",
        className
      )}
    >
      {children}
    </button>
  );
}
