import { MOCK_CUSTOMERS } from "./mock-data";
import {
  Customer,
  FetchCustomersParams,
  FetchCustomersResult,
} from "../types/customer.types";

const LATENCY_MS = 400;

function matchesSearch(customer: Customer, search: string): boolean {
  if (!search.trim()) return true;
  const q = search.toLowerCase();
  return (
    customer.name.toLowerCase().includes(q) ||
    customer.email.toLowerCase().includes(q) ||
    customer.company.toLowerCase().includes(q)
  );
}

function sortCustomers(
  customers: Customer[],
  sort: FetchCustomersParams["sort"]
): Customer[] {
  if (!sort) return customers;
  const { field, direction } = sort;
  const sorted = [...customers].sort((a, b) => {
    const aVal = a[field];
    const bVal = b[field];
    return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
  });
  return direction === "desc" ? sorted.reverse() : sorted;
}

export async function fetchCustomers(
  params: FetchCustomersParams
): Promise<FetchCustomersResult> {
  await new Promise((resolve) => setTimeout(resolve, LATENCY_MS));

  let result = MOCK_CUSTOMERS.filter((c) => matchesSearch(c, params.search));

  result = sortCustomers(result, params.sort);

  const total = result.length;
  const { page, pageSize } = params.pagination;
  const start = (page - 1) * pageSize;
  const data = result.slice(start, start + pageSize);

  return { data, total };
}