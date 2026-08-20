import { useState, useCallback } from "react";
import { CustomerFilters, createEmptyFilters, SavedFilter } from "../types/customer.types";

export function useCustomerFilters() {
  const [filters, setFilters] = useState<CustomerFilters>(createEmptyFilters());
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);

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

  // Saves the CURRENT filters (not a template) under a user-given name
  const saveCurrentFilter = useCallback(
    (name: string) => {
      setSavedFilters((prev) => [
        ...prev,
        { id: `saved_${Date.now()}`, name, filters, order: prev.length },
      ]);
    },
    [filters]
  );

  const applySavedFilter = useCallback((saved: SavedFilter) => {
    setFilters(saved.filters);
  }, []);

  const deleteSavedFilter = useCallback((id: string) => {
    setSavedFilters((prev) => prev.filter((f) => f.id !== id));
  }, []);

  // Called after a drag-and-drop reorder — takes the new full ordered array
  const reorderSavedFilters = useCallback((reordered: SavedFilter[]) => {
    setSavedFilters(reordered.map((f, index) => ({ ...f, order: index })));
  }, []);

  return {
    filters,
    setFilters,
    activeFilterCount,
    clearAll,
    applyTemplate,
    savedFilters,
    saveCurrentFilter,
    applySavedFilter,
    deleteSavedFilter,
    reorderSavedFilters,
  };
}