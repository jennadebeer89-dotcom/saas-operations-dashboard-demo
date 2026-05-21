import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import DashboardPage from "@/app/page";
import { renderWithApp } from "@/test/render";

describe("Dashboard page", () => {
  it("renders the operations overview headline for admin (default)", () => {
    renderWithApp(<DashboardPage />);
    expect(
      screen.getByRole("heading", { name: /operations overview/i }),
    ).toBeInTheDocument();
  });

  it("shows all five KPI tiles", () => {
    renderWithApp(<DashboardPage />);
    expect(screen.getAllByText(/today's appointments/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/checked in/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/pending payments/i)).toBeInTheDocument();
    expect(screen.getByText(/unread messages/i)).toBeInTheDocument();
    expect(screen.getByText(/revenue this month/i)).toBeInTheDocument();
  });

  it("renders today's bookings list with a customer name", () => {
    renderWithApp(<DashboardPage />);
    // From the mock dataset, Aria Bennett has a booking today.
    expect(screen.getAllByText(/Aria Bennett/).length).toBeGreaterThan(0);
  });
});
