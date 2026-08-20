"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { CustomerFilters as Filters, CustomerStatus, SortConfig } from "../types/customer.types";
import { useCompanies } from "../api/customer.queries";
import { FILTER_TEMPLATES } from "../utils/filterTemplates";
import { Filter } from "lucide-react";

interface CustomerFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  activeFilterCount: number;
  onClearAll: () => void;
  onApplyTemplate: (template: { name: string; filters: Partial<Filters>; sort?: SortConfig }) => void;
}

export function CustomerFiltersPanel({
  filters,
  onFiltersChange,
  activeFilterCount,
  onClearAll,
  onApplyTemplate,
}: CustomerFiltersProps) {
  // local draft state so "Apply Filters" is a deliberate action, not
  // instant-on-every-click — brief allows either, this is more testable
  // and matches how the mockups show an explicit Apply button
  const [draft, setDraft] = useState<Filters>(filters);
  const [open, setOpen] = useState(false);
  const [companySearch, setCompanySearch] = useState("");

  function toggleStatus(status: CustomerStatus) {
    setDraft((d) => ({
      ...d,
      status: d.status.includes(status)
        ? d.status.filter((s) => s !== status)
        : [...d.status, status],
    }));
  }

  function toggleCompany(company: string) {
    setDraft((d) => ({
      ...d,
      companies: d.companies.includes(company)
        ? d.companies.filter((c) => c !== company)
        : [...d.companies, company],
    }));
  }

  function handleApply() {
    onFiltersChange(draft);
    setOpen(false);
  }

  function handleClear() {
    onClearAll();
    setOpen(false);
  }

  const { data: companies = [] } = useCompanies();

  const filteredCompanies = companies.filter((c) =>
  c.toLowerCase().includes(companySearch.toLowerCase())
);

  return (
    <Sheet open={open} onOpenChange={(next) => { setOpen(next); if (next) setDraft(filters); }}>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Pre-built templates */}
          <div>
            <p className="text-sm font-medium mb-2">Quick filters</p>
            <div className="flex flex-wrap gap-2">
              {FILTER_TEMPLATES.map((t) => (
                <Button
                  key={t.name}
                  variant="secondary"
                  size="sm"
                  onClick={() => onApplyTemplate(t)}
                >
                  {t.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <p className="text-sm font-medium mb-2">Status</p>
            <div className="space-y-2">
              {(["active", "inactive"] as CustomerStatus[]).map((status) => (
                <label key={status} className="flex items-center gap-2 text-sm capitalize">
                  <Checkbox
                    checked={draft.status.includes(status)}
                    onCheckedChange={() => toggleStatus(status)}
                  />
                  {status}
                </label>
              ))}
            </div>
          </div>

          {/* Company */}
<div>
  <p className="text-sm font-medium mb-2">Company</p>
  <Input
    placeholder="Search companies..."
    value={companySearch}
    onChange={(e) => setCompanySearch(e.target.value)}
    className="mb-2 h-8 text-sm"
  />
  <div className="space-y-2 max-h-40 overflow-y-auto">
    {filteredCompanies.length === 0 && (
      <p className="text-sm text-muted-foreground">No companies match.</p>
    )}
    {filteredCompanies.map((company) => (
      <label key={company} className="flex items-center gap-2 text-sm">
        <Checkbox
          checked={draft.companies.includes(company)}
          onCheckedChange={() => toggleCompany(company)}
        />
        {company}
      </label>
    ))}
  </div>
</div>
          {/* Date range */}
          <div>
            <p className="text-sm font-medium mb-2">Last Contact Date Range</p>
            <div className="flex gap-2">
              <Input
                type="date"
                value={draft.dateRange.from?.slice(0, 10) ?? ""}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    dateRange: { ...d.dateRange, from: e.target.value ? new Date(e.target.value).toISOString() : null },
                  }))
                }
              />
              <Input
                type="date"
                value={draft.dateRange.to?.slice(0, 10) ?? ""}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    dateRange: { ...d.dateRange, to: e.target.value ? new Date(e.target.value).toISOString() : null },
                  }))
                }
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <p className="text-sm font-medium mb-2">Phone Number</p>
            <Input
              placeholder="e.g. 555-1234"
              value={draft.phone}
              onChange={(e) => setDraft((d) => ({ ...d, phone: e.target.value }))}
            />
          </div>

          {/* Email */}
          <div>
            <p className="text-sm font-medium mb-2">Email Contains</p>
            <Input
              placeholder="e.g. @acme.com"
              value={draft.email}
              onChange={(e) => setDraft((d) => ({ ...d, email: e.target.value }))}
            />
          </div>

          <div className="flex gap-2 pt-4 border-t">
            <Button onClick={handleApply} className="flex-1">
              Apply Filters
            </Button>
            <Button variant="outline" onClick={handleClear}>
              Clear All
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}