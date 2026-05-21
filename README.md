# SaaS Operations Dashboard — Demo

[![CI](https://github.com/jennadebeer89-dotcom/saas-operations-dashboard-demo/actions/workflows/ci.yml/badge.svg)](https://github.com/jennadebeer89-dotcom/saas-operations-dashboard-demo/actions/workflows/ci.yml)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

A public demo dashboard inspired by real-world SaaS operations software. Built with **Next.js, React and TypeScript**, featuring **role-based views**, a **check-in / check-out workflow**, **messaging**, and **operational reporting**. Mock data only — safe to share.

> **Live demo:** <https://saas-operations-dashboard-demo.vercel.app>
>
> **Switchable themes:** the same code base ships with two demo skins — a generic SaaS view and a pet-care view — toggled live from the top bar. This is intentional: the same dashboard layout fits many industries (services, appointments, daycare, clinics, studios).

---

## Problem

Operations teams run their day-to-day work across spreadsheets, shared inboxes, and half-built tools. A single dashboard that combines **bookings, check-ins, payments and customer conversations**, with role-appropriate views, removes a lot of that friction.

This repo is a focused demo of that idea — the screens, the workflow, and the polish — without any real production code or customer data.

## Features

- **Role switcher** — Admin / Staff / Client views, with different nav and permissions
- **Theme switcher** — Generic SaaS or Pet Care, swapped from the top bar
- **Dashboard overview** — five KPIs (today's bookings, checked in, pending payments, unread messages, monthly revenue) with delta vs previous month
- **Bookings table** — searchable, status-filterable, with payment status and amounts
- **Check-in / check-out workflow** — drop-off and pickup with timestamps and a live activity log
- **Messaging inbox** — conversation list, message thread, stateful reply box (⌘/Ctrl+Enter to send)
- **Reports** — bookings by week (bar), revenue by month (area), check-in rate (line) via Recharts
- **Customers** — searchable list with plan badges
- **Billing** — collected / pending / failed totals plus payment rows
- **Polish** — loading skeletons, empty states, error boundary, 404, mobile-first responsive, dark mode, preferences persisted in `localStorage`

## Tech stack

- **Next.js 16** (App Router, Turbopack)
- **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- **Recharts** for charts
- **Lucide** for icons
- Mock data only — no database, no auth, no third-party APIs
- Deployed on **Vercel**
- **GitHub Actions** CI: lint + typecheck + build on every PR

## Demo roles

| Role   | Sees                                                            |
| ------ | --------------------------------------------------------------- |
| Admin  | All pages — reports, customers, bookings, billing, messages     |
| Staff  | Operational pages — check-in, bookings, messages, customers     |
| Client | Self-service view — own bookings, billing, messages             |

The role and theme switches live in the top bar. Pages render different content (or block access) based on the active role.

## Operational workflow

The **Check-in / check-out** page is the most polished workflow in the demo:

1. Today's bookings appear with status: `scheduled` → `checked_in` → `checked_out`
2. Action buttons advance status; timestamps are recorded
3. An **Undo** button reverts to the previous state
4. Every action appends to a **live activity log** on the right (newest first)

This pattern — explicit state transitions, audit trail, role-aware actions — is the spine of any real operations tool.

## Screenshots

### Dashboard — light

![Dashboard light](./public/screenshots/dashboard-light.png)

### Dashboard — dark

![Dashboard dark](./public/screenshots/dashboard-dark.png)

### Check-in / check-out workflow

![Check-in workflow](./public/screenshots/check-in.png)

### Bookings table

![Bookings](./public/screenshots/bookings.png)

### Messaging inbox

![Messages](./public/screenshots/messages.png)

### Reports

![Reports](./public/screenshots/reports.png)

### Pet Care theme variant

The same dashboard, re-skinned via the in-app theme switcher.

![Dashboard pet care](./public/screenshots/dashboard-petcare.png)

### Mobile

<p>
  <img src="./public/screenshots/mobile-dashboard.png" alt="Mobile dashboard" width="320" />
  &nbsp;
  <img src="./public/screenshots/mobile-check-in.png" alt="Mobile check-in" width="320" />
</p>

## Running locally

```bash
git clone https://github.com/jennadebeer89-dotcom/saas-operations-dashboard-demo.git
cd saas-operations-dashboard-demo
npm install
npm run dev
```

Open <http://localhost:3000>.

Other scripts:

```bash
npm run lint       # ESLint
npx tsc --noEmit   # Typecheck
npm run build      # Production build
npm start          # Run production build
```

## Running tests

The project uses **Vitest** + **React Testing Library** + **jsdom**.

```bash
npm test           # run the full suite once
npm run test:watch # interactive watch mode
```

Coverage focuses on the most user-facing behaviour:

- Dashboard renders the operations overview and KPI tiles
- Role switcher changes the visible content for `admin` / `staff` / `client`
- Check-in / check-out advances booking status and supports undo
- Messaging inbox opens a thread and appends a sent reply to state
- `EmptyState` renders title, description, and an optional action
- `format` helpers (currency, date, time, percent change) are timezone-safe

Tests run on every push and PR via GitHub Actions (`.github/workflows/ci.yml`).

## Privacy and data

This is a public demo project using fictional data only. It does not include real client data, production code, business rules, payment data, screenshots, credentials, or private system details.

All names, emails, phone numbers, and figures are fabricated. No external services are called, no analytics are loaded, and no API keys or secrets are bundled into the repo.

## Limitations and future work

This is intentionally a UI demo, not a production app. Things deliberately left out — each is straightforward to add later:

- **Real authentication** — currently a mock role switcher; would integrate with NextAuth / Clerk / Auth.js
- **Persistent database** — mock data lives in memory; would swap for Drizzle/Prisma + Postgres
- **Backend API integration** — pages call client-side mock helpers; would split into Server Actions / Route Handlers / tRPC
- **Stripe / payment integration** — payment status is decorative; would wire Checkout, Connect, and the Billing Portal
- **Notification system** — no email/SMS/push; would integrate Resend / Twilio / web push
- **Production observability** — no Sentry, no logging, no metrics; would add error reporting and product analytics
- **Role-based access control** — role gating happens client-side for demo purposes; real RBAC must be enforced server-side

## What this demonstrates

- React + Next.js App Router with client components and persisted state
- TypeScript end-to-end, including a typed mock data layer and shared domain types
- Tailwind v4 design system using CSS custom properties for theming and dark mode
- Reusable UI primitives (`Card`, `Badge`, `Button`, `EmptyState`, `Skeleton`)
- Stateful UI patterns: state machine for booking status, optimistic updates, activity feed
- Multi-tenant / multi-role thinking — same codebase, different views per role
- Configuration-driven theming — same components, different industry skin
- Accessibility basics: `aria-label`, `role="radiogroup"`, focus rings, keyboard send
- Testing discipline: Vitest + React Testing Library covering the dashboard, role switcher, check-in workflow, messaging, and shared helpers
- CI hygiene: GitHub Actions running lint, typecheck, test, and build on every change

## License

MIT — see [LICENSE](./LICENSE).
