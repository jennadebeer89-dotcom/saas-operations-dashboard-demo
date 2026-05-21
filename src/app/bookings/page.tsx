"use client";

import { useMemo, useState } from "react";
import { Calendar, Search, MoreHorizontal } from "lucide-react";
import { useApp } from "@/lib/AppContext";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatCurrencyDetailed, formatDate, formatTime } from "@/lib/format";
import type { BookingStatus, PaymentStatus } from "@/data/mockData";

const STATUS_FILTERS: { value: "all" | BookingStatus; label: string }[] = [
  { value: "all", label: "All" },
  { value: "scheduled", label: "Scheduled" },
  { value: "checked_in", label: "Checked in" },
  { value: "checked_out", label: "Checked out" },
  { value: "cancelled", label: "Cancelled" },
];

export default function BookingsPage() {
  const { labels, data, role } = useApp();
  const [statusFilter, setStatusFilter] = useState<"all" | BookingStatus>("all");
  const [search, setSearch] = useState("");

  // Clients see only their own (we'll mock as customer c1)
  const scope = role === "client"
    ? data.bookings.filter((b) => b.customerId === "c1")
    : data.bookings;

  const filtered = useMemo(() => {
    return scope.filter((b) => {
      if (statusFilter !== "all" && b.status !== statusFilter) return false;
      if (search) {
        const customer = data.customers.find((c) => c.id === b.customerId);
        const item = data.items.find((i) => i.id === b.itemId);
        const hay = [customer?.name, customer?.email, item?.genericName, item?.petName]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!hay.includes(search.toLowerCase())) return false;
      }
      return true;
    });
  }, [scope, statusFilter, search, data.customers, data.items]);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{labels.bookingPlural}</h1>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            {role === "client"
              ? `Your ${labels.bookingPlural.toLowerCase()} and payment status.`
              : `Manage all customer ${labels.bookingPlural.toLowerCase()}.`}
          </p>
        </div>
        {role !== "client" && (
          <Button variant="primary">New {labels.bookingSingular.toLowerCase()}</Button>
        )}
      </header>

      <Card>
        <CardHeader
          title={`${filtered.length} ${labels.bookingPlural.toLowerCase()}`}
          subtitle="Filter by status, or search by name and item"
          action={
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--color-text-muted)]" />
                <input
                  type="search"
                  placeholder="Search…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-8 w-44 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] pl-7 pr-2 text-sm placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]/30"
                />
              </div>
            </div>
          }
        />
        <div className="flex flex-wrap gap-1 border-b border-[var(--color-border)] px-5 py-3">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setStatusFilter(f.value)}
              className={
                "rounded-md px-2.5 py-1 text-xs font-medium transition-colors " +
                (statusFilter === f.value
                  ? "bg-[var(--color-surface-2)] text-[var(--color-text)]"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]")
              }
            >
              {f.label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title={`No ${labels.bookingPlural.toLowerCase()} match`}
            description="Try clearing the filters or search."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)] text-left text-xs font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
                  <th className="px-5 py-2.5">Customer</th>
                  <th className="px-5 py-2.5">{labels.itemSingular}</th>
                  <th className="px-5 py-2.5">Date</th>
                  <th className="px-5 py-2.5">Time</th>
                  <th className="px-5 py-2.5">Status</th>
                  <th className="px-5 py-2.5">Payment</th>
                  <th className="px-5 py-2.5 text-right">Amount</th>
                  <th className="px-5 py-2.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {filtered.map((b) => {
                  const customer = data.customers.find((c) => c.id === b.customerId);
                  const item = data.items.find((i) => i.id === b.itemId);
                  const itemLabel =
                    labels.itemSingular === "Pet" ? item?.petName : item?.genericName;
                  return (
                    <tr key={b.id} className="hover:bg-[var(--color-surface-2)]/50">
                      <td className="px-5 py-3">
                        <div className="font-medium">{customer?.name}</div>
                        <div className="text-xs text-[var(--color-text-muted)]">
                          {customer?.email}
                        </div>
                      </td>
                      <td className="px-5 py-3">{itemLabel}</td>
                      <td className="px-5 py-3">{formatDate(b.date)}</td>
                      <td className="px-5 py-3">
                        {formatTime(b.scheduledStart)} – {formatTime(b.scheduledEnd)}
                      </td>
                      <td className="px-5 py-3">
                        <StatusBadge status={b.status} />
                      </td>
                      <td className="px-5 py-3">
                        <PaymentBadge status={b.paymentStatus} />
                      </td>
                      <td className="px-5 py-3 text-right tabular-nums">
                        {formatCurrencyDetailed(b.amount)}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button
                          type="button"
                          aria-label="More"
                          className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)]"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

function StatusBadge({ status }: { status: BookingStatus }) {
  switch (status) {
    case "checked_in":
      return <Badge tone="success">Checked in</Badge>;
    case "checked_out":
      return <Badge tone="neutral">Checked out</Badge>;
    case "cancelled":
      return <Badge tone="danger">Cancelled</Badge>;
    default:
      return <Badge tone="info">Scheduled</Badge>;
  }
}

function PaymentBadge({ status }: { status: PaymentStatus }) {
  switch (status) {
    case "paid":
      return <Badge tone="success">Paid</Badge>;
    case "pending":
      return <Badge tone="warning">Pending</Badge>;
    case "failed":
      return <Badge tone="danger">Failed</Badge>;
    case "refunded":
      return <Badge tone="neutral">Refunded</Badge>;
  }
}
