"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  ClipboardCheck,
  MessageSquare,
  BarChart3,
  Users,
  CreditCard,
  X,
} from "lucide-react";
import { useApp } from "@/lib/AppContext";
import type { Role } from "@/data/mockData";
import { clsx } from "clsx";

interface NavItem {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  roles: Role[];
}

const NAV: NavItem[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard, roles: ["admin", "staff", "client"] },
  { href: "/bookings", label: "Bookings", icon: Calendar, roles: ["admin", "staff", "client"] },
  { href: "/check-in", label: "Check-in / out", icon: ClipboardCheck, roles: ["admin", "staff"] },
  { href: "/messages", label: "Messages", icon: MessageSquare, roles: ["admin", "staff", "client"] },
  { href: "/reports", label: "Reports", icon: BarChart3, roles: ["admin"] },
  { href: "/customers", label: "Customers", icon: Users, roles: ["admin", "staff"] },
  { href: "/billing", label: "Billing", icon: CreditCard, roles: ["admin", "client"] },
];

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const { role, labels } = useApp();
  const items = NAV.filter((n) => n.roles.includes(role));

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={clsx(
          "fixed inset-0 z-40 bg-black/40 transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
      />
      <aside
        className={clsx(
          "fixed lg:sticky top-0 z-50 lg:z-10 h-screen w-64 shrink-0 border-r border-[var(--color-border)] bg-[var(--color-surface)] transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex h-14 items-center justify-between border-b border-[var(--color-border)] px-4 lg:px-5">
          <div className="text-sm font-semibold">{labels.brand}</div>
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden inline-flex h-8 w-8 items-center justify-center rounded-md text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)]"
            aria-label="Close navigation"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <nav className="space-y-0.5 p-3">
          <div className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
            Workspace
          </div>
          {items.map((item) => {
            const Icon = item.icon;
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={clsx(
                  "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors",
                  active
                    ? "bg-[var(--color-surface-2)] text-[var(--color-text)] font-medium"
                    : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)]",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto p-4">
          <div className="rounded-lg border border-dashed border-[var(--color-border)] p-3 text-xs text-[var(--color-text-muted)]">
            <div className="font-medium text-[var(--color-text)]">Demo mode</div>
            <p className="mt-1 leading-relaxed">
              All data is mock. Role and theme can be switched from the top bar.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
