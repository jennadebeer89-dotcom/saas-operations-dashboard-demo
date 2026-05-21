export type ThemeKey = "generic" | "petcare";

export interface ThemeLabels {
  brand: string;
  brandTagline: string;
  itemSingular: string;
  itemPlural: string;
  customerSingular: string;
  customerPlural: string;
  bookingSingular: string;
  bookingPlural: string;
  checkInVerb: string;
  workflowTitle: string;
  workflowSubtitle: string;
}

export const THEMES: Record<ThemeKey, ThemeLabels> = {
  generic: {
    brand: "Operations Cloud",
    brandTagline: "SaaS operations dashboard",
    itemSingular: "Service",
    itemPlural: "Services",
    customerSingular: "Customer",
    customerPlural: "Customers",
    bookingSingular: "Appointment",
    bookingPlural: "Appointments",
    checkInVerb: "Check in",
    workflowTitle: "Today's appointments",
    workflowSubtitle: "Manage arrivals and departures in real time.",
  },
  petcare: {
    brand: "Pawprint Ops",
    brandTagline: "Pet care operations dashboard",
    itemSingular: "Pet",
    itemPlural: "Pets",
    customerSingular: "Owner",
    customerPlural: "Owners",
    bookingSingular: "Booking",
    bookingPlural: "Bookings",
    checkInVerb: "Drop off",
    workflowTitle: "Today's bookings",
    workflowSubtitle: "Drop-offs, pickups, and the day's activity feed.",
  },
};
