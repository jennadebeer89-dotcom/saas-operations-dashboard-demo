import { describe, it, expect } from "vitest";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/react";
import DashboardPage from "@/app/page";
import { Topbar } from "@/components/shell/Topbar";
import { renderWithApp } from "@/test/render";

describe("Role switcher", () => {
  it("changes the dashboard heading when switching from admin to client", async () => {
    const user = userEvent.setup();
    renderWithApp(
      <>
        <Topbar />
        <DashboardPage />
      </>,
    );

    expect(
      screen.getByRole("heading", { name: /operations overview/i }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("radio", { name: /client/i }));

    expect(
      screen.getByRole("heading", { name: /welcome back/i }),
    ).toBeInTheDocument();
  });

  it("marks the active role with aria-checked", async () => {
    const user = userEvent.setup();
    renderWithApp(<Topbar />);
    const staff = screen.getByRole("radio", { name: /staff/i });
    expect(staff).toHaveAttribute("aria-checked", "false");
    await user.click(staff);
    expect(staff).toHaveAttribute("aria-checked", "true");
  });
});
