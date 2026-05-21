import { describe, it, expect } from "vitest";
import userEvent from "@testing-library/user-event";
import { screen, within } from "@testing-library/react";
import CheckInPage from "@/app/check-in/page";
import { renderWithApp } from "@/test/render";

describe("Check-in / check-out workflow", () => {
  it("renders the workflow heading by default (admin role)", () => {
    renderWithApp(<CheckInPage />);
    expect(
      screen.getByRole("heading", { name: /today's appointments/i }),
    ).toBeInTheDocument();
  });

  it("advances a scheduled booking to checked in when the action button is pressed", async () => {
    const user = userEvent.setup();
    renderWithApp(<CheckInPage />);

    // Marcus Cole (b2) starts as 'scheduled' in the mock dataset.
    const marcusRow = screen.getByText(/Marcus Cole/).closest("li") as HTMLElement;
    expect(marcusRow).not.toBeNull();
    const row = within(marcusRow);

    expect(row.getByText(/Scheduled/i)).toBeInTheDocument();
    await user.click(row.getByRole("button", { name: /check in/i }));
    expect(row.getByText(/Checked in/i)).toBeInTheDocument();
  });

  it("can be reverted with the undo button after checking in", async () => {
    const user = userEvent.setup();
    renderWithApp(<CheckInPage />);

    const row = within(
      screen.getByText(/Marcus Cole/).closest("li") as HTMLElement,
    );

    await user.click(row.getByRole("button", { name: /check in/i }));
    expect(row.getByText(/Checked in/i)).toBeInTheDocument();

    await user.click(row.getByRole("button", { name: /undo/i }));
    expect(row.getByText(/Scheduled/i)).toBeInTheDocument();
  });
});
