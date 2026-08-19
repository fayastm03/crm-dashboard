import { useState, useCallback } from "react";
import { CustomerFilters, createEmptyFilters } from "../types/customer.types";

/**
 * Owns all filter state in one place. Why a dedicated hook instead of
 * useState calls scattered in the dashboard component: the dashboard
 * would otherwise need 5+ separate useState calls plus setters passed
 * down through props — this hook packages state + update logic together
 * and gives the component a small, clear API.
 */
export function useCustomerFilters() {
  const [filters, setFilters] = useState<CustomerFilters>(createEmptyFilters());

  const activeFilterCount =
    filters.status.length +
    filters.companies.length +
    (filters.dateRange.from || filters.dateRange.to ? 1 : 0) +
    (filters.phone ? 1 : 0) +
    (filters.email ? 1 : 0);

  const clearAll = useCallback(() => setFilters(createEmptyFilters()), []);

const applyTemplate = useCallback((template: Partial<CustomerFilters>) => {
  setFilters({ ...createEmptyFilters(), ...template });
}, []);

  return { filters, setFilters, activeFilterCount, clearAll, applyTemplate };
}