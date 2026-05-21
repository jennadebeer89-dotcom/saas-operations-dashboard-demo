"use client";

import {
  Calendar,
  ClipboardCheck,
  CreditCard,
  MessageSquare,
  TrendingUp,
  Activity,
} from "lucide-react";
import { useApp } from "@/lib/AppContext";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, formatTime, percentChange } from "@/lib/format";
import { RelativeTime } from "@/components/ui/RelativeTime";
import { DEMO_TODAY } from "@/data/mockData";

export default function DashboardPage() {
  const { role, labels, data } = useApp();
  const todayIso = DEMO_TODAY;

  const todays = data.bookings.filter((b) => b.date === todayIso);
  const checkedIn = todays.filter((b) => b.status === "checked_in").length;
  const scheduled = todays.filter((b) => b.status === "scheduled").length;
  const pendingPayments = data.bookings.filter((b) => b.paymentStatus === "pending").length;
  const unread = data.conversations.reduce(
    (n, c) => n + c.messages.filter((m) => !m.read && m.from === "customer").length,
    0,
  );
  const revenueDelta = percentChange(data.kpis.revenueThisMonth, data.kpis.revenuePrevMonth);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
            {role === "client" ? "Your account" : "Today"}
          </div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">
            {role === "client" ? "Welcome back" : "Operations overview"}
          </h1>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            {role === "client"
              ? `Your upcoming ${labels.bookingPlural.toLowerCase()}, messages and billing.`
              : `Live snapshot of ${labels.bookingPlural.toLowerCase()}, revenue and recent activity.`}
          </p>
        </div>
        <Badge tone="brand">{labels.brandTagline}</Badge>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <KpiCard
          icon={Calendar}
          label={`Today's ${labels.bookingPlural}`}
          value={String(todays.length)}
          hint={`${scheduled} scheduled · ${checkedIn} active`}
        />
        <KpiCard
          icon={ClipboardCheck}
          label="Checked in"
          value={String(checkedIn)}
          hint={`of ${todays.length} ${labels.bookingPlural.toLowerCase()}`}
        />
        <KpiCard
          icon={CreditCard}
          label="Pending payments"
          value={String(pendingPayments)}
          hint="across all bookings"
        />
        <KpiCard
          icon={MessageSquare}
          label="Unread messages"
          value={String(unread)}
          hint="from customers"
        />
        <KpiCard
          icon={TrendingUp}
          label="Revenue this month"
          value={formatCurrency(data.kpis.revenueThisMonth)}
          delta={revenueDelta}
          hint="vs last month"
        />
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title={`Today's ${labels.bookingPlural.toLowerCase()}`}
            subtitle={`${todays.length} scheduled · ${checkedIn} currently in`}
          />
          <CardBody className="p-0">
            <ul className="divide-y divide-[var(--color-border)]">
              {todays.map((b) => {
                const customer = data.customers.find((c) => c.id === b.customerId);
                const item = data.items.find((i) => i.id === b.itemId);
                const label =
                  labels.itemSingular === "Pet" ? item?.petName : item?.genericName;
                return (
                  <li key={b.id} className="flex items-center gap-3 px-5 py-3">
                    <div className="grid h-9 w-9 place-items-center rounded-full bg-[var(--color-surface-2)] text-xs font-semibold">
                      {(customer?.name ?? "?").slice(0, 1)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">
                        {customer?.name}
                        <span className="ml-2 text-[var(--color-text-muted)] font-normal">
                          {label}
                        </span>
                      </div>
                      <div className="mt-0.5 text-xs text-[var(--color-text-muted)]">
                        {formatTime(b.scheduledStart)} – {formatTime(b.scheduledEnd)}
                      </div>
                    </div>
                    <StatusBadge status={b.status} />
                  </li>
                );
              })}
            </ul>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Recent activity" subtitle="Latest operations events" />
          <CardBody className="p-0">
            <ul className="divide-y divide-[var(--color-border)]">
              {data.activity.slice(0, 8).map((a) => (
                <li key={a.id} className="flex items-start gap-3 px-5 py-3">
                  <div className="mt-0.5 grid h-7 w-7 place-items-center rounded-full bg-[var(--color-surface-2)] text-[var(--color-text-muted)]">
                    <Activity className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm">
                      <span className="font-medium">{a.action}</span>
                      <span className="text-[var(--color-text-muted)]"> — {a.detail}</span>
                    </div>
                    <div className="mt-0.5 text-xs text-[var(--color-text-muted)]">
                      {a.actor} · <RelativeTime iso={a.at} />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </section>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
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
