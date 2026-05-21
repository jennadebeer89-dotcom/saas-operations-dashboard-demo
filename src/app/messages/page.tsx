"use client";

import { useMemo, useState } from "react";
import { Send, Inbox } from "lucide-react";
import { useApp } from "@/lib/AppContext";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatTime } from "@/lib/format";
import { RelativeTime } from "@/components/ui/RelativeTime";
import { clsx } from "clsx";

export default function MessagesPage() {
  const { data, sendMessage, role } = useApp();
  const conversations = useMemo(() => {
    return role === "client"
      ? data.conversations.filter((c) => c.customerId === "c1" || c.id === "conv2")
      : data.conversations;
  }, [data.conversations, role]);

  const [selectedId, setSelectedId] = useState<string | null>(
    conversations[0]?.id ?? null,
  );
  const [draft, setDraft] = useState("");

  const selected = conversations.find((c) => c.id === selectedId) ?? null;
  const selectedCustomer = selected
    ? data.customers.find((c) => c.id === selected.customerId)
    : null;

  const onSend = () => {
    if (!selected || !draft.trim()) return;
    sendMessage(selected.id, draft);
    setDraft("");
  };

  return (
    <div className="space-y-4">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Messages</h1>
        <p className="text-sm text-[var(--color-text-muted)]">
          Conversations with customers. Replies update in real time (mock state).
        </p>
      </header>

      <Card className="overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] min-h-[560px]">
          <aside className="border-b lg:border-b-0 lg:border-r border-[var(--color-border)]">
            <div className="border-b border-[var(--color-border)] px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
              Inbox
            </div>
            {conversations.length === 0 ? (
              <EmptyState
                icon={Inbox}
                title="No conversations"
                description="When a customer messages you, it'll appear here."
              />
            ) : (
              <ul className="divide-y divide-[var(--color-border)]">
                {conversations.map((conv) => {
                  const customer = data.customers.find((c) => c.id === conv.customerId);
                  const last = conv.messages[conv.messages.length - 1];
                  const unread = conv.messages.some((m) => !m.read && m.from === "customer");
                  return (
                    <li key={conv.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedId(conv.id)}
                        className={clsx(
                          "block w-full px-4 py-3 text-left transition-colors",
                          selectedId === conv.id
                            ? "bg-[var(--color-surface-2)]"
                            : "hover:bg-[var(--color-surface-2)]/50",
                        )}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="truncate text-sm font-medium">
                            {customer?.name}
                          </div>
                          {unread && (
                            <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--color-brand)]" />
                          )}
                        </div>
                        <div className="mt-0.5 truncate text-xs text-[var(--color-text-muted)]">
                          {conv.subject}
                        </div>
                        <div className="mt-1 truncate text-xs text-[var(--color-text-muted)]">
                          {last?.body}
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </aside>

          <section className="flex min-h-[560px] flex-col">
            {selected ? (
              <>
                <div className="border-b border-[var(--color-border)] px-5 py-3">
                  <div className="text-sm font-semibold">{selectedCustomer?.name}</div>
                  <div className="text-xs text-[var(--color-text-muted)]">
                    {selected.subject} · {selectedCustomer?.email}
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto px-5 py-4">
                  <ul className="space-y-3">
                    {selected.messages.map((m) => {
                      const mine = m.from === "staff";
                      return (
                        <li
                          key={m.id}
                          className={clsx("flex", mine ? "justify-end" : "justify-start")}
                        >
                          <div
                            className={clsx(
                              "max-w-[80%] rounded-2xl px-3.5 py-2 text-sm",
                              mine
                                ? "bg-[var(--color-brand)] text-[var(--color-brand-fg)] rounded-br-md"
                                : "bg-[var(--color-surface-2)] rounded-bl-md",
                            )}
                          >
                            <div>{m.body}</div>
                            <div
                              className={clsx(
                                "mt-1 text-[10px]",
                                mine ? "opacity-75" : "text-[var(--color-text-muted)]",
                              )}
                            >
                              {formatTime(m.at)} · <RelativeTime iso={m.at} />
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div className="border-t border-[var(--color-border)] p-3">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      onSend();
                    }}
                    className="flex items-end gap-2"
                  >
                    <textarea
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                          e.preventDefault();
                          onSend();
                        }
                      }}
                      placeholder="Write a reply…"
                      rows={2}
                      className="flex-1 resize-none rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]/30"
                    />
                    <button
                      type="submit"
                      disabled={!draft.trim()}
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[var(--color-brand)] px-3 text-sm font-medium text-[var(--color-brand-fg)] hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Send className="h-3.5 w-3.5" />
                      Send
                    </button>
                  </form>
                  <div className="mt-1 text-[11px] text-[var(--color-text-muted)]">
                    ⌘/Ctrl + Enter to send
                  </div>
                </div>
              </>
            ) : (
              <EmptyState
                icon={Inbox}
                title="Select a conversation"
                description="Pick a thread from the inbox on the left."
              />
            )}
          </section>
        </div>
      </Card>
    </div>
  );
}
