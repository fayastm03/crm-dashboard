# Advanced CRM Dashboard

## Setup

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## What's scaffolded (Phase 0)

- Next.js App Router + TypeScript + Tailwind, configured for shadcn/ui
- `src/app/providers.tsx` — TanStack Query's `QueryClientProvider`, wired into `layout.tsx`
- `src/features/customers/types/customer.types.ts` — the `Customer` domain model and every supporting type (`CustomerFilters`, `SortConfig`, `FetchCustomersParams`, etc.) that the rest of the app will import
- `src/features/customers/api/mock-data.ts` — 150 deterministically-generated customers (seeded PRNG, so the dataset is identical on every run — useful for reliable manual testing of filters)
- `src/lib/utils.ts` — the `cn()` helper shadcn/ui components expect

## Next steps (Phase 1)

1. Install shadcn/ui components as you need them, e.g.:
   ```bash
   npx shadcn@latest add table button input badge dialog sheet form select checkbox toast dropdown-menu popover calendar
   ```
2. Build `src/features/customers/api/mock-api.ts` — an async function that takes `FetchCustomersParams` and returns `FetchCustomersResult`, applying search/filter/sort/pagination against `MOCK_CUSTOMERS` with a simulated delay.
3. Wrap it in `src/features/customers/api/customer.queries.ts` with `useQuery`/`useMutation` hooks.
4. Build `CustomerTable` + search + sorting + pagination on top of that.

## Design decisions

- **Mock dataset uses a seeded PRNG**, not `@faker-js/faker` — avoids an extra dependency for something this small and keeps output identical run to run.
- **`Providers` is a separate client component** rather than making `layout.tsx` itself a client component — keeps the root layout server-rendered where possible.
