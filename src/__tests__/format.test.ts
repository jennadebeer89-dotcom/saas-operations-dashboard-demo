import { describe, it, expect } from "vitest";
import { formatCurrency, formatDate, formatTime, percentChange } from "@/lib/format";

describe("format helpers", () => {
  it("formats GBP currency without decimals", () => {
    expect(formatCurrency(18420)).toMatch(/£18,420/);
  });

  it("formats ISO date as 'D MMM YYYY'", () => {
    expect(formatDate("2026-05-21T08:30:00.000Z")).toBe("21 May 2026");
  });

  it("returns wall-clock HH:MM from ISO string (timezone-free)", () => {
    expect(formatTime("2026-05-21T08:30:00.000Z")).toBe("08:30");
  });

  it("computes percent change correctly", () => {
    expect(percentChange(110, 100)).toBe(10);
    expect(percentChange(50, 100)).toBe(-50);
    expect(percentChange(100, 0)).toBe(0);
  });
});
