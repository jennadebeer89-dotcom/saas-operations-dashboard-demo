import type { ThemeKey } from "./themes";

export type Role = "admin" | "staff" | "client";

export type BookingStatus = "scheduled" | "checked_in" | "checked_out" | "cancelled";
export type PaymentStatus = "paid" | "pending" | "failed" | "refunded";

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinedAt: string;
  plan: "starter" | "pro" | "enterprise" | "free";
}

export interface Item {
  id: string;
  customerId: string;
  genericName: string;
  petName: string;
  genericMeta: string;
  petMeta: string;
}

export interface Booking {
  id: string;
  customerId: string;
  itemId: string;
  date: string;
  scheduledStart: string;
  scheduledEnd: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  amount: number;
  checkedInAt?: string;
  checkedOutAt?: string;
}

export interface ActivityEntry {
  id: string;
  at: string;
  actor: string;
  action: string;
  detail: string;
}

export interface Message {
  id: string;
  body: string;
  at: string;
  from: "customer" | "staff";
  read: boolean;
}

export interface Conversation {
  id: string;
  customerId: string;
  subject: string;
  messages: Message[];
}

export interface Dataset {
  customers: Customer[];
  items: Item[];
  bookings: Booking[];
  activity: ActivityEntry[];
  conversations: Conversation[];
  kpis: {
    revenueThisMonth: number;
    revenuePrevMonth: number;
    bookingsByWeek: { week: string; count: number }[];
    revenueByMonth: { month: string; revenue: number }[];
    checkInRate: { month: string; rate: number }[];
  };
}

// Fixed reference date so SSR and client hydration produce identical output.
// Update this constant occasionally to keep the demo looking "today-ish".
export const DEMO_TODAY = "2026-05-21";

const isoOf = (offsetDays = 0, h = 9, m = 0) => {
  const d = new Date(`${DEMO_TODAY}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + offsetDays);
  d.setUTCHours(h, m, 0, 0);
  return d.toISOString();
};

const todayDate = DEMO_TODAY;

export const customers: Customer[] = [
  { id: "c1", name: "Aria Bennett", email: "aria.bennett@example.com", phone: "+44 7700 900111", joinedAt: "2024-03-12", plan: "pro" },
  { id: "c2", name: "Marcus Cole", email: "marcus.cole@example.com", phone: "+44 7700 900222", joinedAt: "2024-06-04", plan: "starter" },
  { id: "c3", name: "Priya Shah", email: "priya.shah@example.com", phone: "+44 7700 900333", joinedAt: "2023-11-21", plan: "enterprise" },
  { id: "c4", name: "Tomasz Nowak", email: "tomasz.nowak@example.com", phone: "+44 7700 900444", joinedAt: "2025-01-09", plan: "pro" },
  { id: "c5", name: "Hana Suzuki", email: "hana.suzuki@example.com", phone: "+44 7700 900555", joinedAt: "2024-09-18", plan: "free" },
  { id: "c6", name: "Diego Ortega", email: "diego.ortega@example.com", phone: "+44 7700 900666", joinedAt: "2025-02-27", plan: "pro" },
  { id: "c7", name: "Lena Fischer", email: "lena.fischer@example.com", phone: "+44 7700 900777", joinedAt: "2024-12-02", plan: "starter" },
  { id: "c8", name: "Oluwaseun Adebayo", email: "oluwaseun.a@example.com", phone: "+44 7700 900888", joinedAt: "2025-03-14", plan: "pro" },
];

export const items: Item[] = [
  { id: "i1", customerId: "c1", genericName: "Workspace Alpha", petName: "Biscuit", genericMeta: "Premium plan · 2 seats", petMeta: "Cocker Spaniel · 4 yrs" },
  { id: "i2", customerId: "c2", genericName: "Workspace Beta", petName: "Mochi", genericMeta: "Starter plan · 1 seat", petMeta: "Shiba Inu · 2 yrs" },
  { id: "i3", customerId: "c3", genericName: "Workspace Gamma", petName: "Pepper", genericMeta: "Enterprise · 12 seats", petMeta: "Border Collie · 6 yrs" },
  { id: "i4", customerId: "c4", genericName: "Workspace Delta", petName: "Toffee", genericMeta: "Premium plan · 3 seats", petMeta: "Labrador · 3 yrs" },
  { id: "i5", customerId: "c5", genericName: "Workspace Echo", petName: "Luna", genericMeta: "Free trial", petMeta: "Whippet · 5 yrs" },
  { id: "i6", customerId: "c6", genericName: "Workspace Foxtrot", petName: "Bramble", genericMeta: "Premium plan · 2 seats", petMeta: "Golden Retriever · 2 yrs" },
  { id: "i7", customerId: "c7", genericName: "Workspace Golf", petName: "Sage", genericMeta: "Starter plan · 1 seat", petMeta: "Beagle · 7 yrs" },
  { id: "i8", customerId: "c8", genericName: "Workspace Hotel", petName: "Juno", genericMeta: "Premium plan · 4 seats", petMeta: "Vizsla · 3 yrs" },
];

export const bookings: Booking[] = [
  { id: "b1", customerId: "c1", itemId: "i1", date: todayDate, scheduledStart: isoOf(0, 8, 30), scheduledEnd: isoOf(0, 17, 0), status: "checked_in", paymentStatus: "paid", amount: 42, checkedInAt: isoOf(0, 8, 41) },
  { id: "b2", customerId: "c2", itemId: "i2", date: todayDate, scheduledStart: isoOf(0, 9, 0), scheduledEnd: isoOf(0, 17, 30), status: "scheduled", paymentStatus: "pending", amount: 38 },
  { id: "b3", customerId: "c3", itemId: "i3", date: todayDate, scheduledStart: isoOf(0, 9, 15), scheduledEnd: isoOf(0, 16, 30), status: "checked_in", paymentStatus: "paid", amount: 56, checkedInAt: isoOf(0, 9, 22) },
  { id: "b4", customerId: "c4", itemId: "i4", date: todayDate, scheduledStart: isoOf(0, 7, 45), scheduledEnd: isoOf(0, 15, 30), status: "checked_out", paymentStatus: "paid", amount: 42, checkedInAt: isoOf(0, 7, 50), checkedOutAt: isoOf(0, 15, 35) },
  { id: "b5", customerId: "c5", itemId: "i5", date: todayDate, scheduledStart: isoOf(0, 10, 0), scheduledEnd: isoOf(0, 17, 0), status: "scheduled", paymentStatus: "paid", amount: 38 },
  { id: "b6", customerId: "c6", itemId: "i6", date: todayDate, scheduledStart: isoOf(0, 8, 0), scheduledEnd: isoOf(0, 18, 0), status: "scheduled", paymentStatus: "failed", amount: 50 },
  { id: "b7", customerId: "c7", itemId: "i7", date: isoOf(1).slice(0, 10), scheduledStart: isoOf(1, 9, 0), scheduledEnd: isoOf(1, 17, 0), status: "scheduled", paymentStatus: "paid", amount: 38 },
  { id: "b8", customerId: "c8", itemId: "i8", date: isoOf(1).slice(0, 10), scheduledStart: isoOf(1, 9, 30), scheduledEnd: isoOf(1, 16, 30), status: "scheduled", paymentStatus: "pending", amount: 42 },
  { id: "b9", customerId: "c1", itemId: "i1", date: isoOf(-1).slice(0, 10), scheduledStart: isoOf(-1, 9, 0), scheduledEnd: isoOf(-1, 17, 0), status: "checked_out", paymentStatus: "paid", amount: 42, checkedInAt: isoOf(-1, 9, 10), checkedOutAt: isoOf(-1, 16, 50) },
  { id: "b10", customerId: "c3", itemId: "i3", date: isoOf(-1).slice(0, 10), scheduledStart: isoOf(-1, 9, 0), scheduledEnd: isoOf(-1, 17, 0), status: "checked_out", paymentStatus: "paid", amount: 56, checkedInAt: isoOf(-1, 9, 5), checkedOutAt: isoOf(-1, 17, 2) },
];

export const activity: ActivityEntry[] = [
  { id: "a1", at: isoOf(0, 9, 22), actor: "Staff · Jordan", action: "Checked in", detail: "Workspace Gamma — Priya Shah" },
  { id: "a2", at: isoOf(0, 8, 41), actor: "Staff · Riley", action: "Checked in", detail: "Workspace Alpha — Aria Bennett" },
  { id: "a3", at: isoOf(0, 8, 12), actor: "System", action: "Payment captured", detail: "£42.00 — Aria Bennett" },
  { id: "a4", at: isoOf(0, 7, 50), actor: "Staff · Riley", action: "Checked in", detail: "Workspace Delta — Tomasz Nowak" },
  { id: "a5", at: isoOf(-1, 17, 2), actor: "Staff · Jordan", action: "Checked out", detail: "Workspace Gamma — Priya Shah" },
];

export const conversations: Conversation[] = [
  {
    id: "conv1",
    customerId: "c2",
    subject: "Payment issue this morning",
    messages: [
      { id: "m1", from: "customer", at: isoOf(0, 8, 5), body: "Hi — my payment didn't seem to go through this morning. Card on file should be working.", read: true },
      { id: "m2", from: "staff", at: isoOf(0, 8, 18), body: "Thanks Marcus — checking with billing now and will report back shortly.", read: true },
      { id: "m3", from: "customer", at: isoOf(0, 8, 32), body: "Appreciated, no rush.", read: false },
    ],
  },
  {
    id: "conv2",
    customerId: "c6",
    subject: "Schedule change for next week",
    messages: [
      { id: "m4", from: "customer", at: isoOf(-1, 14, 0), body: "Can we move Tuesday's slot to Wednesday instead?", read: true },
      { id: "m5", from: "staff", at: isoOf(-1, 14, 12), body: "Yes — confirmed, you're booked in Wednesday 9am.", read: true },
    ],
  },
  {
    id: "conv3",
    customerId: "c4",
    subject: "Receipt request",
    messages: [
      { id: "m6", from: "customer", at: isoOf(-2, 10, 0), body: "Could I get a copy of last month's invoices for accounting?", read: true },
      { id: "m7", from: "staff", at: isoOf(-2, 10, 18), body: "Sent over to your registered email — let me know if anything is missing.", read: true },
    ],
  },
  {
    id: "conv4",
    customerId: "c8",
    subject: "Welcome onboarding",
    messages: [
      { id: "m8", from: "staff", at: isoOf(-3, 9, 0), body: "Welcome aboard! Here's everything you need for your first session.", read: true },
      { id: "m9", from: "customer", at: isoOf(-3, 9, 30), body: "Thank you — looks great.", read: true },
    ],
  },
];

export const dataset: Dataset = {
  customers,
  items,
  bookings,
  activity,
  conversations,
  kpis: {
    revenueThisMonth: 18420,
    revenuePrevMonth: 16210,
    bookingsByWeek: [
      { week: "W-5", count: 38 },
      { week: "W-4", count: 42 },
      { week: "W-3", count: 47 },
      { week: "W-2", count: 51 },
      { week: "W-1", count: 49 },
      { week: "This", count: 54 },
    ],
    revenueByMonth: [
      { month: "Dec", revenue: 12100 },
      { month: "Jan", revenue: 13560 },
      { month: "Feb", revenue: 14820 },
      { month: "Mar", revenue: 15970 },
      { month: "Apr", revenue: 16210 },
      { month: "May", revenue: 18420 },
    ],
    checkInRate: [
      { month: "Dec", rate: 92 },
      { month: "Jan", rate: 94 },
      { month: "Feb", rate: 93 },
      { month: "Mar", rate: 96 },
      { month: "Apr", rate: 95 },
      { month: "May", rate: 97 },
    ],
  },
};

export function labelForItem(item: Item, theme: ThemeKey) {
  return theme === "petcare" ? item.petName : item.genericName;
}
export function metaForItem(item: Item, theme: ThemeKey) {
  return theme === "petcare" ? item.petMeta : item.genericMeta;
}
