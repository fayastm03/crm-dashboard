# Advanced CRM Dashboard

A customer management dashboard built with Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, and TanStack Query, backed by a mock API layer.

## Setup

\`\`\`bash
npm install
npm run dev
\`\`\`

Open http://localhost:3000.

## Tech Stack

- **Next.js (App Router)** + **TypeScript**
- **Tailwind CSS** + **shadcn/ui** components
- **TanStack Query** for data fetching, caching, and mutations
- **react-hook-form** + **zod** for form state and validation
- **@dnd-kit** for drag-and-drop (chosen over react-beautiful-dnd, which is unmaintained and has known React 18 Strict Mode issues)

## Architecture

Feature-based folder structure — everything related to "customers" lives under `src/features/customers/`:

\`\`\`
src/features/customers/
├── api/          # mock API + TanStack Query hooks
├── components/   # all UI components for this feature
├── hooks/        # feature-specific hooks (filters, debounce)
├── schemas/      # zod validation schemas
├── types/        # the single source of truth for data shapes
└── utils/        # pure functions (filter templates)
\`\`\`

Components never talk to data directly — everything flows through typed hooks in `api/customer.queries.ts`, which wrap `api/mock-api.ts`. If this were backed by a real API, only the internals of `mock-api.ts` would need to change; every component, hook, and type stays the same.

## Design Decisions

- **Mock data uses a seeded PRNG**, not a library like `@faker-js/faker` — keeps the dataset dependency-free and identical on every run, which made testing filters more reliable.
- **Mutations live in a module-level array (`mutableCustomers`)** separate from the original seed data (`mock-data.ts`), so the original 150 records stay untouched as a reference "reset point." Data does **not** persist across a page refresh — this is intentional for a mock API; if this became a real app, only the data-layer functions in `mock-api.ts` would change to call a real backend.
- **Company filter list is derived live from customer data** (`fetchCompanies`), not hardcoded — so a company introduced via "Add Customer" immediately shows up as filterable.
- **Filters apply in real time** as the user selects them (the brief allows either an Apply button or real-time), rather than requiring an explicit "Apply" click — this also means "Save current filter" always saves exactly what's currently selected, with no extra step.
- **Phone and email filter inputs are debounced** (300ms) since they're free-text; checkboxes and date pickers apply instantly since they're discrete selections, not typing.
- **Filter templates can set a default sort** — e.g. "Recent Contacts" also sorts by last-contact-date descending, since "recent" implies an order, not just a subset.
- **Drag-and-drop scope: reordering Saved Filters** (one of the three options the brief allows), implemented with `@dnd-kit/core` + `@dnd-kit/sortable`. Drag is isolated to a dedicated grip handle so clicking "Apply" or delete on a saved filter doesn't get mistaken for a drag gesture.
- **Pagination self-corrects** if the current page becomes out of range after a delete or a filter narrows the result set, rather than showing a blank page.
- **Mock API has ~400ms simulated latency** specifically so loading states are visible/demonstrable, not just theoretically implemented.

## What I'd do with more time

- Optimistic updates for mutations (listed as an optional bonus in the brief — not implemented, so the UI waits for the mock API round-trip before updating)
- Bulk actions (select multiple, bulk status change/delete)
- CSV export of filtered results
- Persisting saved filters to `localStorage` so they survive a refresh
- Duplicate-email validation on the Add/Edit form