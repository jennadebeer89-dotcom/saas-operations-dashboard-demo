"use client";

import { useState } from "react";
import { Users, Search } from "lucide-react";
import { useApp } from "@/lib/AppContext";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate } from "@/lib/format";

export default function CustomersPage() {
  const { data, labels, role } = useApp();
  const [search, setSearch] = useState("");

  if (role === "client") {
    return (
      <Card>
        <div className="p-5">
          <EmptyState
            icon={Users}
            title="Not available for this role"
            description={`${labels.customerPlural} are only visible to staff and admins.`}
          />
        </div>
      </Card>
    );
  }

  const filtered = data.customers.filter((c) => {
    if (!search) return true;
    const hay = `${c.name} ${c.email} ${c.phone}`.toLowerCase();
    return hay.includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{labels.customerPlural}</h1>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            All {labels.customerPlural.toLowerCase()} and their plan.
          </p>
        </div>
      </header>

      <Card>
        <CardHeader
          title={`${filtered.length} ${labels.customerPlural.toLowerCase()}`}
          subtitle="Search by name, email or phone"
          action={
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
          }
        />
        {filtered.length === 0 ? (
          <EmptyState
            icon={Users}
            title={`No ${labels.customerPlural.toLowerCase()} found`}
            description="Try a different search term."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)] text-left text-xs font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
                  <th className="px-5 py-2.5">Name</th>
                  <th className="px-5 py-2.5">Email</th>
                  <th className="px-5 py-2.5">Phone</th>
                  <th className="px-5 py-2.5">Plan</th>
                  <th className="px-5 py-2.5">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-[var(--color-surface-2)]/50">
                    <td className="px-5 py-3 font-medium">{c.name}</td>
                    <td className="px-5 py-3 text-[var(--color-text-muted)]">{c.email}</td>
                    <td className="px-5 py-3 text-[var(--color-text-muted)]">{c.phone}</td>
                    <td className="px-5 py-3">
                      <PlanBadge plan={c.plan} />
                    </td>
                    <td className="px-5 py-3 text-[var(--color-text-muted)]">
                      {formatDate(c.joinedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

function PlanBadge({ plan }: { plan: "starter" | "pro" | "enterprise" | "free" }) {
  const map = {
    free: { tone: "neutral", label: "Free" },
    starter: { tone: "info", label: "Starter" },
    pro: { tone: "brand", label: "Pro" },
    enterprise: { tone: "success", label: "Enterprise" },
  } as const;
  const { tone, label } = map[plan];
  return <Badge tone={tone}>{label}</Badge>;
}
