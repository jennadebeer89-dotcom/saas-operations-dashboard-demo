import { describe, it, expect } from "vitest";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/react";
import MessagesPage from "@/app/messages/page";
import { renderWithApp } from "@/test/render";

describe("Messaging inbox", () => {
  it("renders the inbox heading and conversation list", () => {
    renderWithApp(<MessagesPage />);
    expect(screen.getByRole("heading", { name: /messages/i })).toBeInTheDocument();
    // Customer names from mockData conversations
    expect(screen.getAllByText(/Marcus Cole/).length).toBeGreaterThan(0);
    expect(screen.getByText(/Diego Ortega/)).toBeInTheDocument();
  });

  it("opens a conversation and shows its messages when selected", async () => {
    const user = userEvent.setup();
    renderWithApp(<MessagesPage />);

    await user.click(screen.getByText(/Receipt request/i));
    expect(
      screen.getByText(/Could I get a copy of last month's invoices/i),
    ).toBeInTheDocument();
  });

  it("appends a sent reply to the thread and clears the draft", async () => {
    const user = userEvent.setup();
    renderWithApp(<MessagesPage />);

    const textarea = screen.getByPlaceholderText(/write a reply/i);
    await user.type(textarea, "Looking into this now.");
    await user.click(screen.getByRole("button", { name: /send/i }));

    expect(screen.getAllByText(/Looking into this now\./).length).toBeGreaterThan(0);
    expect(textarea).toHaveValue("");
  });
});
