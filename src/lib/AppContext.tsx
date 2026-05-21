"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  dataset as initialDataset,
  type ActivityEntry,
  type Booking,
  type BookingStatus,
  type Conversation,
  type Dataset,
  type Message,
  type Role,
} from "@/data/mockData";
import { THEMES, type ThemeKey, type ThemeLabels } from "@/data/themes";

interface AppState {
  role: Role;
  setRole: (r: Role) => void;

  theme: ThemeKey;
  setTheme: (t: ThemeKey) => void;
  labels: ThemeLabels;

  darkMode: boolean;
  toggleDarkMode: () => void;

  data: Dataset;
  setBookingStatus: (bookingId: string, status: BookingStatus) => void;
  sendMessage: (conversationId: string, body: string) => void;

  loaded: boolean;
}

const AppContext = createContext<AppState | null>(null);

const STORAGE_KEY = "sodd:prefs:v1";

interface StoredPrefs {
  role?: Role;
  theme?: ThemeKey;
  darkMode?: boolean;
}

function readPrefs(): StoredPrefs {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredPrefs) : {};
  } catch {
    return {};
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  // Render SSR-safe defaults on first paint; rehydrate from localStorage after mount.
  // This avoids hydration mismatch on the initial render.
  const [role, setRole] = useState<Role>("admin");
  const [theme, setTheme] = useState<ThemeKey>("generic");
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [data, setData] = useState<Dataset>(initialDataset);
  const [hydrated, setHydrated] = useState(false);

  // One-time hydration from persisted prefs. setState in effect is correct here
  // (no cascade — runs once on mount), so we silence the new strict rule.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const prefs = readPrefs();
    if (prefs.role) setRole(prefs.role);
    if (prefs.theme) setTheme(prefs.theme);
    if (typeof prefs.darkMode === "boolean") setDarkMode(prefs.darkMode);
    setHydrated(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!hydrated) return;
    const prefs: StoredPrefs = { role, theme, darkMode };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      // ignore quota or privacy-mode errors
    }
  }, [role, theme, darkMode, hydrated]);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [darkMode]);

  const toggleDarkMode = useCallback(() => setDarkMode((d) => !d), []);

  const setBookingStatus = useCallback(
    (bookingId: string, status: BookingStatus) => {
      setData((prev) => {
        const nextBookings = prev.bookings.map<Booking>((b) => {
          if (b.id !== bookingId) return b;
          const now = new Date().toISOString();
          const updated: Booking = { ...b, status };
          if (status === "checked_in") updated.checkedInAt = now;
          if (status === "checked_out") updated.checkedOutAt = now;
          return updated;
        });
        const target = prev.bookings.find((b) => b.id === bookingId);
        const customer = prev.customers.find((c) => c.id === target?.customerId);
        const item = prev.items.find((i) => i.id === target?.itemId);
        const itemLabel = item ? (theme === "petcare" ? item.petName : item.genericName) : "";
        const verbMap: Record<BookingStatus, string> = {
          scheduled: "Reset to scheduled",
          checked_in: "Checked in",
          checked_out: "Checked out",
          cancelled: "Cancelled",
        };
        const entry: ActivityEntry = {
          id: `a-${Date.now()}`,
          at: new Date().toISOString(),
          actor: "You",
          action: verbMap[status],
          detail: `${itemLabel}${customer ? ` — ${customer.name}` : ""}`,
        };
        return {
          ...prev,
          bookings: nextBookings,
          activity: [entry, ...prev.activity].slice(0, 50),
        };
      });
    },
    [theme],
  );

  const sendMessage = useCallback((conversationId: string, body: string) => {
    if (!body.trim()) return;
    setData((prev) => {
      const nextConversations = prev.conversations.map<Conversation>((conv) => {
        if (conv.id !== conversationId) return conv;
        const msg: Message = {
          id: `m-${Date.now()}`,
          from: "staff",
          at: new Date().toISOString(),
          body: body.trim(),
          read: true,
        };
        return { ...conv, messages: [...conv.messages, msg] };
      });
      return { ...prev, conversations: nextConversations };
    });
  }, []);

  const value = useMemo<AppState>(
    () => ({
      role,
      setRole,
      theme,
      setTheme,
      labels: THEMES[theme],
      darkMode,
      toggleDarkMode,
      data,
      setBookingStatus,
      sendMessage,
      loaded: hydrated,
    }),
    [role, theme, darkMode, data, setBookingStatus, sendMessage, toggleDarkMode, hydrated],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}
