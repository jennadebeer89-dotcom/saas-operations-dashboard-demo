"use client";

import { useApp } from "@/lib/AppContext";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatCurrencyDetailed, formatDate } from "@/lib/format";
import { CreditCard } from "lucide-react";
import type { PaymentStatus } from "@/data/mockData";

export default function BillingPage() {
  const { data, role, labels } = useApp();

  const scope = role === "client"
    ? data.bookings.filter((b) => b.customerId === "c1")
    : data.bookings;

  if (scope.length === 0) {
    return (
      <Card>
        <EmptyState
          icon={CreditCard}
          title="No billing activity"
          description="Payments and invoices will appear here once you have bookings."
        />
      </Card>
    );
  }

  const totals = {
    paid: scope.filter((b) => b.paymentStatus === "paid").reduce((s, b) => s + b.amount, 0),
    pending: scope.filter((b) => b.paymentStatus === "pending").reduce((s, b) => s + b.amount, 0),
    failed: scope.filter((b) => b.paymentStatus === "failed").reduce((s, b) => s + b.amount, 0),
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Billing</h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          {role === "client" ? "Your invoices and payment status." : "All customer payments."}
        </p>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SumCard label="Collected" tone="success" value={totals.paid} />
        <SumCard label="Pending" tone="warning" value={totals.pending} />
        <SumCard label="Failed" tone="danger" value={totals.failed} />
      </section>

      <Card>
        <CardHeader title="Payments" subtitle="One row per booking" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-left text-xs font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
                <th className="px-5 py-2.5">Customer</th>
                <th className="px-5 py-2.5">{labels.itemSingular}</th>
                <th className="px-5 py-2.5">Date</th>
                <th className="px-5 py-2.5">Status</th>
                <th className="px-5 py-2.5 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {scope.map((b) => {
                const customer = data.customers.find((c) => c.id === b.customerId);
                const item = data.items.find((i) => i.id === b.itemId);
                const itemLabel =
                  labels.itemSingular === "Pet" ? item?.petName : item?.genericName;
                return (
                  <tr key={b.id} className="hover:bg-[var(--color-surface-2)]/50">
                    <td className="px-5 py-3 font-medium">{customer?.name}</td>
                    <td className="px-5 py-3">{itemLabel}</td>
                    <td className="px-5 py-3 text-[var(--color-text-muted)]">
                      {formatDate(b.date)}
                    </td>
                    <td className="px-5 py-3">
                      <PaymentBadge status={b.paymentStatus} />
                    </td>
                    <td className="px-5 py-3 text-right tabular-nums">
                      {formatCurrencyDetailed(b.amount)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function SumCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "success" | "warning" | "danger";
}) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
          {label}
        </div>
        <Badge tone={tone}>{tone === "success" ? "OK" : tone === "warning" ? "Review" : "Action"}</Badge>
      </div>
      <div className="mt-2 text-2xl font-semibold tabular-nums">
        {formatCurrencyDetailed(value)}
      </div>
    </div>
  );
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
