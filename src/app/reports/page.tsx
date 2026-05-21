"use client";

import { useApp } from "@/lib/AppContext";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Lock } from "lucide-react";
import { formatCurrency, percentChange } from "@/lib/format";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function ReportsPage() {
  const { data, role, labels, darkMode } = useApp();

  if (role !== "admin") {
    return (
      <Card>
        <CardBody>
          <EmptyState
            icon={Lock}
            title="Reports are admin-only"
            description="Switch to Admin role from the top bar to view reports."
          />
        </CardBody>
      </Card>
    );
  }

  const stroke = darkMode ? "#2a2f3d" : "#e4e4e7";
  const axis = darkMode ? "#9aa3b2" : "#6b7280";
  const brand = darkMode ? "#818cf8" : "#4f46e5";

  const revenueDelta = percentChange(data.kpis.revenueThisMonth, data.kpis.revenuePrevMonth);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Reports</h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          Operational and revenue trends across recent months.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader
            title={`${labels.bookingPlural} by week`}
            subtitle="Last 6 weeks"
            action={<Badge tone="info">Weekly</Badge>}
          />
          <CardBody>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.kpis.bookingsByWeek}>
                  <CartesianGrid stroke={stroke} strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="week" stroke={axis} fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke={axis} fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: darkMode ? "#14171f" : "#fff",
                      border: `1px solid ${stroke}`,
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="count" fill={brand} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Revenue by month"
            subtitle={`This month ${formatCurrency(data.kpis.revenueThisMonth)}`}
            action={
              <Badge tone={revenueDelta >= 0 ? "success" : "danger"}>
                {revenueDelta >= 0 ? "+" : ""}{revenueDelta}%
              </Badge>
            }
          />
          <CardBody>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.kpis.revenueByMonth}>
                  <defs>
                    <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={brand} stopOpacity={0.35} />
                      <stop offset="100%" stopColor={brand} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke={stroke} strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" stroke={axis} fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke={axis} fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: darkMode ? "#14171f" : "#fff",
                      border: `1px solid ${stroke}`,
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                    formatter={(v) => formatCurrency(Number(v))}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke={brand}
                    fill="url(#revFill)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader
            title="Check-in rate"
            subtitle="Percentage of bookings that checked in on time"
            action={<Badge tone="success">Healthy</Badge>}
          />
          <CardBody>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.kpis.checkInRate}>
                  <CartesianGrid stroke={stroke} strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" stroke={axis} fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis
                    domain={[80, 100]}
                    stroke={axis}
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip
                    contentStyle={{
                      background: darkMode ? "#14171f" : "#fff",
                      border: `1px solid ${stroke}`,
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                    formatter={(v) => `${v}%`}
                  />
                  <Line
                    type="monotone"
                    dataKey="rate"
                    stroke={brand}
                    strokeWidth={2}
                    dot={{ fill: brand, r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>
      </section>
    </div>
  );
}
