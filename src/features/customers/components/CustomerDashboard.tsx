"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCustomers } from "../api/customer.queries";
import { useDebounce } from "../hooks/useDebounce";
import { CustomerTable } from "./CustomerTable";
import {
  Customer,
  CustomerFilters as Filters,
  PaginationState,
  SortConfig,
  SortableField,
} from "../types/customer.types";
import { useCustomerFilters } from "../hooks/useCustomerFilters";
import { CustomerFiltersPanel } from "./CustomerFilters";
import { CustomerFormDialog } from "./CustomerFormDialog";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { CustomerDetailDrawer } from "./CustomerDetailDrawer";
import { Toaster } from "@/components/ui/toaster";
import { CustomerTableSkeleton } from "./CustomerTableSkeleton";
import { EmptyState } from "./EmptyState";

export function CustomerDashboard() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [sort, setSort] = useState<SortConfig | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 10,
  });
 const {
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
} = useCustomerFilters();

  const { data, isLoading, isError, error, refetch } = useCustomers({
    search: debouncedSearch,
    filters,
    sort,
    pagination,
  });

  // Add/Edit form dialog state
  const [formOpen, setFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  // Delete confirmation state
  const [deletingCustomer, setDeletingCustomer] = useState<Customer | null>(null);

  // Detail drawer state
  const [detailCustomer, setDetailCustomer] = useState<Customer | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  useEffect(() => {
    if (!data) return;
    const maxPage = Math.max(1, Math.ceil(data.total / pagination.pageSize));
    if (pagination.page > maxPage) {
      setPagination((p) => ({ ...p, page: maxPage }));
    }
  }, [data, pagination.pageSize, pagination.page]);


  function handleSortChange(field: SortableField) {
    setSort((prev) => {
      if (prev?.field !== field) return { field, direction: "asc" };
      if (prev.direction === "asc") return { field, direction: "desc" };
      return null; // third click clears sort
    });
  }

  function handleFiltersChange(next: Filters) {
    setFilters(next);
    setPagination((p) => ({ ...p, page: 1 }));
  }

  function handleAddNew() {
    setEditingCustomer(null);
    setFormOpen(true);
  }

  function handleEdit(customer: Customer) {
    setEditingCustomer(customer);
    setDetailOpen(false); // close drawer if editing from within it
    setFormOpen(true);
  }

  function handleDelete(customer: Customer) {
    setDeletingCustomer(customer);
  }

  function handleRowClick(customer: Customer) {
    setDetailCustomer(customer);
    setDetailOpen(true);
  }

  const totalPages = data ? Math.ceil(data.total / pagination.pageSize) : 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between">
        <div className="flex items-center gap-4">
          <Input
            placeholder="Search customers..."
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            className="max-w-sm"
          />

       <CustomerFiltersPanel
  filters={filters}
  onFiltersChange={handleFiltersChange}
  activeFilterCount={activeFilterCount}
  onClearAll={clearAll}
  onApplyTemplate={(template) => {
    applyTemplate(template.filters);
    if (template.sort) setSort(template.sort);
    setPagination((p) => ({ ...p, page: 1 }));
  }}
  savedFilters={savedFilters}
  onSaveCurrentFilter={saveCurrentFilter}
  onApplySavedFilter={(f) => {
    applySavedFilter(f);
    setPagination((p) => ({ ...p, page: 1 }));
  }}
  onDeleteSavedFilter={deleteSavedFilter}
  onReorderSavedFilters={reorderSavedFilters}
/>
        </div>

        <Button onClick={handleAddNew}>Add Customer</Button>
      </div>

     {isLoading && !data && <CustomerTableSkeleton />}
      {isError && (
        <div className="text-destructive">
          <p>Failed to load customers: {(error as Error).message}</p>
          <Button variant="outline" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      )}

{data && (
  <>
    {data.data.length === 0 ? (
      <EmptyState
        hasActiveFilters={activeFilterCount > 0 || search.trim().length > 0}
        onClearFilters={() => {
          clearAll();
          setSearch("");
        }}
      />
    ) : (
      <CustomerTable
        customers={data.data}
        sort={sort}
        onSortChange={handleSortChange}
        onRowClick={handleRowClick}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    )}

          {data.data.length > 0 && (
            <div className="flex items-center justify-between">
            <Select
              value={String(pagination.pageSize)}
              onValueChange={(val) =>
                setPagination({ page: 1, pageSize: Number(val) as 10 | 25 | 50 })
              }
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 / page</SelectItem>
                <SelectItem value="25">25 / page</SelectItem>
                <SelectItem value="50">50 / page</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                disabled={pagination.page <= 1}
                onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {pagination.page} of {totalPages}
              </span>
              <Button
                variant="outline"
                disabled={pagination.page >= totalPages}
                onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
              >
                Next
              </Button>
            </div>
          </div>)}
        </>
      )}

      <CustomerFormDialog open={formOpen} onOpenChange={setFormOpen} customer={editingCustomer} />
      <DeleteConfirmDialog
        open={Boolean(deletingCustomer)}
        onOpenChange={(open) => !open && setDeletingCustomer(null)}
        customer={deletingCustomer}
      />
      <CustomerDetailDrawer
        open={detailOpen}
        onOpenChange={setDetailOpen}
        customer={detailCustomer}
        onEdit={handleEdit}
      />
      <Toaster />
    </div>
  );
}