import { MOCK_CUSTOMERS } from "./mock-data";
import {
  Customer,
  CustomerFilters,
  CustomerInput,
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

// Each filter type is its own small function. Why: when the brief says
// "test your filters thoroughly", you want to be able to unit-test each
// one individually rather than one giant tangled boolean expression.
function matchesStatus(customer: Customer, statuses: CustomerFilters["status"]): boolean {
  if (statuses.length === 0) return true; // no filter selected = show all
  return statuses.includes(customer.status);
}

function matchesCompany(customer: Customer, companies: string[]): boolean {
  if (companies.length === 0) return true;
  return companies.includes(customer.company);
}

function matchesDateRange(customer: Customer, range: CustomerFilters["dateRange"]): boolean {
  if (!range.from && !range.to) return true;
  const contactTime = new Date(customer.lastContactDate).getTime();
  if (range.from && contactTime < new Date(range.from).getTime()) return false;
  if (range.to && contactTime > new Date(range.to).getTime()) return false;
  return true;
}

function matchesPhone(customer: Customer, phone: string): boolean {
  if (!phone.trim()) return true;
  // strip formatting so "555-1234" matches "+1 (555) 123-4567"
  const digitsOnly = (s: string) => s.replace(/\D/g, "");
  return digitsOnly(customer.phone).includes(digitsOnly(phone));
}

function matchesEmail(customer: Customer, email: string): boolean {
  if (!email.trim()) return true;
  return customer.email.toLowerCase().includes(email.toLowerCase());
}

function applyFilters(customers: Customer[], filters: CustomerFilters): Customer[] {
  return customers.filter(
    (c) =>
      matchesStatus(c, filters.status) &&
      matchesCompany(c, filters.companies) &&
      matchesDateRange(c, filters.dateRange) &&
      matchesPhone(c, filters.phone) &&
      matchesEmail(c, filters.email)
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

  let result = mutableCustomers.filter((c) => matchesSearch(c, params.search));
  result = applyFilters(result, params.filters);
  result = sortCustomers(result, params.sort);

  const total = result.length;
  const { page, pageSize } = params.pagination;
  const start = (page - 1) * pageSize;
  const data = result.slice(start, start + pageSize);

  return { data, total };
}

export async function fetchCompanies(): Promise<string[]> {
  await new Promise((resolve) => setTimeout(resolve, 150)); // shorter latency, this is a small lookup
  const unique = Array.from(new Set(mutableCustomers.map((c) => c.company))).filter(Boolean);
  return unique.sort();
}

let mutableCustomers = [...MOCK_CUSTOMERS]; // module-level array so mutations persist across calls in this session

export async function createCustomer(input: CustomerInput): Promise<Customer> {
  await new Promise((resolve) => setTimeout(resolve, LATENCY_MS));

  const newCustomer: Customer = {
    ...input,
    id: `cust_${Date.now()}`, // good enough for a mock; a real backend would generate this
    createdDate: new Date().toISOString(),
  };
  mutableCustomers = [newCustomer, ...mutableCustomers];
  return newCustomer;
}

export async function updateCustomer(
  id: string,
  input: Partial<CustomerInput>
): Promise<Customer> {
  await new Promise((resolve) => setTimeout(resolve, LATENCY_MS));

  const index = mutableCustomers.findIndex((c) => c.id === id);
  if (index === -1) throw new Error("Customer not found");

  const updated = { ...mutableCustomers[index], ...input };
  mutableCustomers[index] = updated;
  return updated;
}

export async function deleteCustomer(id: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, LATENCY_MS));
  mutableCustomers = mutableCustomers.filter((c) => c.id !== id);
}