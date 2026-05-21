import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { clsx } from "clsx";

export function KpiCard({
  label,
  value,
  hint,
  delta,
  icon: Icon,
}: {
  label: string;
  value: string;
  hint?: string;
  delta?: number;
  icon: LucideIcon;
}) {
  const positive = (delta ?? 0) >= 0;
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
          {label}
        </div>
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--color-surface-2)] text-[var(--color-text-muted)]">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-3 text-2xl font-semibold tracking-tight">{value}</div>
      <div className="mt-1 flex items-center gap-2 text-xs">
        {typeof delta === "number" && (
          <span
            className={clsx(
              "inline-flex items-center gap-0.5 font-medium",
              positive ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400",
            )}
          >
            {positive ? (
              <ArrowUpRight className="h-3.5 w-3.5" />
            ) : (
              <ArrowDownRight className="h-3.5 w-3.5" />
            )}
            {Math.abs(delta)}%
          </span>
        )}
        {hint && <span className="text-[var(--color-text-muted)]">{hint}</span>}
      </div>
    </div>
  );
}
