import { clsx } from "clsx";
import type { ReactNode } from "react";

type Tone = "neutral" | "success" | "warning" | "danger" | "info" | "brand";

const TONE: Record<Tone, string> = {
  neutral:
    "bg-[var(--color-surface-2)] text-[var(--color-text-muted)] border-[var(--color-border)]",
  success: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
  warning: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30",
  danger: "bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/30",
  info: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30",
  brand: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/30",
};

export function Badge({
  tone = "neutral",
  children,
  className,
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium",
        TONE[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
