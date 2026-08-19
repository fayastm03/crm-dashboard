import { CustomerFilters } from "../types/customer.types";

// Pure data, not components — keeps the "what are the presets" question
// separate from "how are they rendered", so this file is trivially testable.
export const FILTER_TEMPLATES: { name: string; filters: Partial<CustomerFilters> }[] = [
  {
    name: "Active Customers",
    filters: { status: ["active"] },
  },
  {
    name: "Recent Contacts",
    filters: {
      dateRange: {
        from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        to: null,
      },
    },
  },
  {
    name: "Inactive Leads",
    filters: { status: ["inactive"] },
  },
];