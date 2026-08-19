"use client";

import { useState } from "react";
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
  createEmptyFilters,
  PaginationState,
  SortConfig,
  SortableField,
} from "../types/customer.types";

export function CustomerDashboard() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [sort, setSort] = useState<SortConfig | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 10,
  });

  const { data, isLoading, isError, error, refetch } = useCustomers({
    search: debouncedSearch,
    filters: createEmptyFilters(), // real filters plug in here in Phase 2
    sort,
    pagination,
  });

  function handleSortChange(field: SortableField) {
    setSort((prev) => {
      if (prev?.field !== field) return { field, direction: "asc" };
      if (prev.direction === "asc") return { field, direction: "desc" };
      return null; // third click clears sort
    });
  }

  const totalPages = data ? Math.ceil(data.total / pagination.pageSize) : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {isLoading && <p className="text-muted-foreground">Loading customers…</p>}

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
          <CustomerTable
            customers={data.data}
            sort={sort}
            onSortChange={handleSortChange}
            onRowClick={(c: Customer) => console.log("open detail", c)}
            onEdit={(c: Customer) => console.log("edit", c)}
            onDelete={(c: Customer) => console.log("delete", c)}
          />

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
          </div>
        </>
      )}
    </div>
  );
}