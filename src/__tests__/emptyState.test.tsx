import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Inbox } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";

describe("EmptyState", () => {
  it("renders the title and description", () => {
    render(
      <EmptyState
        icon={Inbox}
        title="No conversations"
        description="When a customer messages you, it'll appear here."
      />,
    );

    expect(
      screen.getByRole("heading", { name: /no conversations/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/when a customer messages you/i),
    ).toBeInTheDocument();
  });

  it("renders an action node when provided", () => {
    render(
      <EmptyState
        icon={Inbox}
        title="Empty"
        action={<button>Create one</button>}
      />,
    );

    expect(screen.getByRole("button", { name: /create one/i })).toBeInTheDocument();
  });
});
