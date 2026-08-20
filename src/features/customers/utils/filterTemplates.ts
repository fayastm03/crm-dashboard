import { CustomerFilters, SortConfig } from "../types/customer.types";

export const FILTER_TEMPLATES: {
  name: string;
  filters: Partial<CustomerFilters>;
  sort?: SortConfig;
}[] = [
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
    sort: { field: "lastContactDate", direction: "desc" }, // most recent first
  },
  {
    name: "Inactive Leads",
    filters: { status: ["inactive"] },
  },
];