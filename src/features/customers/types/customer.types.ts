export type CustomerStatus = "active" | "inactive";

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: CustomerStatus;
  lastContactDate: string; // ISO 8601 date string
  createdDate: string; // ISO 8601 date string
  notes: string;
}

/** Shape used by the Add/Edit form, before an id/createdDate exist. */
export type CustomerInput = Omit<Customer, "id" | "createdDate">;

export interface CustomerFilters {
  status: CustomerStatus[];
  companies: string[];
  dateRange: { from: string | null; to: string | null };
  phone: string;
  email: string;
}

export function createEmptyFilters(): CustomerFilters {
  return {
    status: [],
    companies: [],
    dateRange: { from: null, to: null },
    phone: "",
    email: "",
  };
}

export interface SavedFilter {
  id: string;
  name: string;
  filters: CustomerFilters;
  order: number;
}

export type SortableField = "name" | "email" | "company" | "lastContactDate";

export interface SortConfig {
  field: SortableField;
  direction: "asc" | "desc";
}

export interface PaginationState {
  page: number;
  pageSize: 10 | 25 | 50;
}

/** Params the mock (or real) API accepts — mirrors what a real backend query string would carry. */
export interface FetchCustomersParams {
  search: string;
  filters: CustomerFilters;
  sort: SortConfig | null;
  pagination: PaginationState;
}

export interface FetchCustomersResult {
  data: Customer[];
  total: number;
}
