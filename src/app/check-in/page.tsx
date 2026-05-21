"use client";

import { useMemo } from "react";
import { Activity, LogIn, LogOut, RotateCcw, Clock } from "lucide-react";
import { useApp } from "@/lib/AppContext";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatTime } from "@/lib/format";
import { RelativeTime } from "@/components/ui/RelativeTime";
import { DEMO_TODAY, type BookingStatus } from "@/data/mockData";

export default function CheckInPage() {
  const { labels, data, setBookingStatus, role } = useApp();
  const todayIso = DEMO_TODAY;

  const todays = useMemo(
    () => data.bookings.filter((b) => b.date === todayIso),
    [data.bookings, todayIso],
  );

  const counts = useMemo(() => {
    return {
      scheduled: todays.filter((b) => b.status === "scheduled").length,
      checked_in: todays.filter((b) => b.status === "checked_in").length,
      checked_out: todays.filter((b) => b.status === "checked_out").length,
    };
  }, [todays]);

  if (role === "client") {
    return (
      <Card>
        <CardBody>
          <EmptyState
            icon={Clock}
            title="Not available for this role"
            description="The check-in workflow is for staff and admins. Switch role from the top bar to try it."
          />
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">{labels.workflowTitle}</h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">{labels.workflowSubtitle}</p>
      </header>

      <section className="grid grid-cols-3 gap-4">
        <Stat label="Scheduled" value={counts.scheduled} tone="info" />
        <Stat label="Checked in" value={counts.checked_in} tone="success" />
        <Stat label="Checked out" value={counts.checked_out} tone="neutral" />
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Arrivals and departures"
            subtitle="Update status as customers arrive and leave"
          />
          <CardBody className="p-0">
            {todays.length === 0 ? (
              <EmptyState
                icon={Clock}
                title={`No ${labels.bookingPlural.toLowerCase()} today`}
                description="Check tomorrow's schedule on the bookings page."
              />
            ) : (
              <ul className="divide-y divide-[var(--color-border)]">
                {todays.map((b) => {
                  const customer = data.customers.find((c) => c.id === b.customerId);
                  const item = data.items.find((i) => i.id === b.itemId);
                  const itemLabel =
                    labels.itemSingular === "Pet" ? item?.petName : item?.genericName;
                  const itemMeta =
                    labels.itemSingular === "Pet" ? item?.petMeta : item?.genericMeta;
                  return (
                    <li key={b.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center">
                      <div className="flex min-w-0 flex-1 items-center gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-full bg-[var(--color-surface-2)] text-sm font-semibold">
                          {(customer?.name ?? "?").slice(0, 1)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-semibold">
                            {itemLabel}
                            <span className="ml-2 text-[var(--color-text-muted)] font-normal">
                              {customer?.name}
                            </span>
                          </div>
                          <div className="mt-0.5 text-xs text-[var(--color-text-muted)]">
                            {itemMeta} · {formatTime(b.scheduledStart)} – {formatTime(b.scheduledEnd)}
                          </div>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-[var(--color-text-muted)]">
                            {b.checkedInAt && (
                              <span>In: {formatTime(b.checkedInAt)}</span>
                            )}
                            {b.checkedOutAt && (
                              <span>Out: {formatTime(b.checkedOutAt)}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 sm:flex-shrink-0">
                        <StatusBadge status={b.status} />
                        <div className="flex gap-1.5">
                          {b.status === "scheduled" && (
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() => setBookingStatus(b.id, "checked_in")}
                            >
                              <LogIn className="h-3.5 w-3.5" />
                              Check in
                            </Button>
                          )}
                          {b.status === "checked_in" && (
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => setBookingStatus(b.id, "checked_out")}
                            >
                              <LogOut className="h-3.5 w-3.5" />
                              Check out
                            </Button>
                          )}
                          {(b.status === "checked_in" || b.status === "checked_out") && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setBookingStatus(b.id, "scheduled")}
                              aria-label="Undo"
                              title="Reset to scheduled"
                            >
                              <RotateCcw className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Activity log" subtitle="Live feed of operations events" />
          <CardBody className="p-0">
            <ul className="divide-y divide-[var(--color-border)]">
              {data.activity.slice(0, 12).map((a) => (
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
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "info" | "success" | "neutral";
}) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
          {label}
        </div>
        <Badge tone={tone}>now</Badge>
      </div>
      <div className="mt-2 text-3xl font-semibold tabular-nums">{value}</div>
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
