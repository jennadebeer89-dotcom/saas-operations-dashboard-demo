import { clsx } from "clsx";
import type { HTMLAttributes, ReactNode } from "react";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        "rounded-xl border bg-[var(--color-surface)] border-[var(--color-border)] shadow-sm",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3 p-5 border-b border-[var(--color-border)]">
      <div>
        <h2 className="text-base font-semibold text-[var(--color-text)]">{title}</h2>
        {subtitle && (
          <p className="mt-0.5 text-sm text-[var(--color-text-muted)]">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}

export function CardBody({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx("p-5", className)} {...props} />;
}
