"use client";

import { useState, useEffect } from "react";
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
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { SortableSavedFilter } from "./SortableSavedFilter";
import { useCompanies } from "../api/customer.queries";
import { useDebounce } from "../hooks/useDebounce";
import {
  CustomerFilters as Filters,
  CustomerStatus,
  SortConfig,
  SavedFilter,
} from "../types/customer.types";
import { FILTER_TEMPLATES } from "../utils/filterTemplates";
import { Filter } from "lucide-react";

interface CustomerFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  activeFilterCount: number;
  onClearAll: () => void;
  onApplyTemplate: (template: { name: string; filters: Partial<Filters>; sort?: SortConfig }) => void;
  savedFilters: SavedFilter[];
  onSaveCurrentFilter: (name: string) => void;
  onApplySavedFilter: (filter: SavedFilter) => void;
  onDeleteSavedFilter: (id: string) => void;
  onReorderSavedFilters: (reordered: SavedFilter[]) => void;
}

function SectionDivider() {
  return <div className="h-px bg-border my-5" />;
}

export function CustomerFiltersPanel({
  filters,
  onFiltersChange,
  activeFilterCount,
  onClearAll,
  onApplyTemplate,
  savedFilters,
  onSaveCurrentFilter,
  onApplySavedFilter,
  onDeleteSavedFilter,
  onReorderSavedFilters,
}: CustomerFiltersProps) {
  const [open, setOpen] = useState(false);
  const [companySearch, setCompanySearch] = useState("");
  const [saveFilterName, setSaveFilterName] = useState("");
  const { data: companies = [] } = useCompanies();

  // Phone/email need their own local + debounced state so every keystroke
  // doesn't immediately re-filter the table — everything else (checkboxes,
  // dates) applies instantly since those are discrete clicks, not typing.
  const [phoneInput, setPhoneInput] = useState(filters.phone);
  const [emailInput, setEmailInput] = useState(filters.email);
  const debouncedPhone = useDebounce(phoneInput, 300);
  const debouncedEmail = useDebounce(emailInput, 300);

  useEffect(() => {
    if (debouncedPhone !== filters.phone) {
      onFiltersChange({ ...filters, phone: debouncedPhone });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedPhone]);

  useEffect(() => {
    if (debouncedEmail !== filters.email) {
      onFiltersChange({ ...filters, email: debouncedEmail });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedEmail]);

  // Keep the local text inputs in sync when filters change from OUTSIDE
  // this panel — e.g. a template, a saved filter, or Clear All.
  useEffect(() => {
    setPhoneInput(filters.phone);
    setEmailInput(filters.email);
  }, [filters.phone, filters.email]);

  const filteredCompanies = companies.filter((c) =>
    c.toLowerCase().includes(companySearch.toLowerCase())
  );

  function toggleStatus(status: CustomerStatus) {
    const next = filters.status.includes(status)
      ? filters.status.filter((s) => s !== status)
      : [...filters.status, status];
    onFiltersChange({ ...filters, status: next });
  }

  function toggleCompany(company: string) {
    const next = filters.companies.includes(company)
      ? filters.companies.filter((c) => c !== company)
      : [...filters.companies, company];
    onFiltersChange({ ...filters, companies: next });
  }

  function handleSaveFilter() {
    if (!saveFilterName.trim()) return;
    onSaveCurrentFilter(saveFilterName.trim());
    setSaveFilterName("");
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = savedFilters.findIndex((f) => f.id === active.id);
    const newIndex = savedFilters.findIndex((f) => f.id === over.id);
    onReorderSavedFilters(arrayMove(savedFilters, oldIndex, newIndex));
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
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

      <SheetContent className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="px-6 pt-6 pb-0">
          <div className="flex items-center justify-between">
            <SheetTitle>Filters</SheetTitle>
            {activeFilterCount > 0 && (
              <button
                onClick={onClearAll}
                className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-2"
              >
                Clear all
              </button>
            )}
          </div>
        </SheetHeader>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {/* Quick templates */}
          <div className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
              Quick filters
            </p>
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

          <SectionDivider />

          {/* Save current filter */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
              Save current filter
            </p>
            <div className="flex gap-2">
              <Input
                placeholder="Filter name"
                value={saveFilterName}
                onChange={(e) => setSaveFilterName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSaveFilter()}
              />
              <Button
                variant="outline"
                onClick={handleSaveFilter}
                disabled={!saveFilterName.trim() || activeFilterCount === 0}
              >
                Save
              </Button>
            </div>
            {activeFilterCount === 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                Select at least one filter below to save it.
              </p>
            )}
          </div>

          {savedFilters.length > 0 && (
            <div className="mt-4">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={savedFilters.map((f) => f.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2">
                    {savedFilters.map((f) => (
                      <SortableSavedFilter
                        key={f.id}
                        filter={f}
                        onApply={onApplySavedFilter}
                        onDelete={onDeleteSavedFilter}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          )}

          <SectionDivider />

          {/* Status — applies instantly on click */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
              Status
            </p>
            <div className="space-y-2">
              {(["active", "inactive"] as CustomerStatus[]).map((status) => (
                <label key={status} className="flex items-center gap-2 text-sm capitalize cursor-pointer">
                  <Checkbox
                    checked={filters.status.includes(status)}
                    onCheckedChange={() => toggleStatus(status)}
                  />
                  {status}
                </label>
              ))}
            </div>
          </div>

          <SectionDivider />

          {/* Company — applies instantly on click */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
              Company
            </p>
            <Input
              placeholder="Search companies..."
              value={companySearch}
              onChange={(e) => setCompanySearch(e.target.value)}
              className="mb-2 h-8 text-sm"
            />
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {filteredCompanies.length === 0 && (
                <p className="text-sm text-muted-foreground">No companies match.</p>
              )}
              {filteredCompanies.map((company) => (
                <label key={company} className="flex items-center gap-2 text-sm cursor-pointer">
                  <Checkbox
                    checked={filters.companies.includes(company)}
                    onCheckedChange={() => toggleCompany(company)}
                  />
                  {company}
                </label>
              ))}
            </div>
          </div>

          <SectionDivider />

          {/* Date range — applies instantly on change */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
              Last Contact Date Range
            </p>
            <div className="flex gap-2">
              <Input
                type="date"
                value={filters.dateRange.from?.slice(0, 10) ?? ""}
                onChange={(e) =>
                  onFiltersChange({
                    ...filters,
                    dateRange: {
                      ...filters.dateRange,
                      from: e.target.value ? new Date(e.target.value).toISOString() : null,
                    },
                  })
                }
              />
              <Input
                type="date"
                value={filters.dateRange.to?.slice(0, 10) ?? ""}
                onChange={(e) =>
                  onFiltersChange({
                    ...filters,
                    dateRange: {
                      ...filters.dateRange,
                      to: e.target.value ? new Date(e.target.value).toISOString() : null,
                    },
                  })
                }
              />
            </div>
          </div>

          <SectionDivider />

          {/* Phone — debounced */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
              Phone Number
            </p>
            <Input
              placeholder="e.g. 555-1234"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
            />
          </div>

          <SectionDivider />

          {/* Email — debounced */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
              Email Contains
            </p>
            <Input
              placeholder="e.g. @acme.com"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
            />
          </div>
        </div>

        {/* Sticky footer */}
        <div className="border-t px-6 py-4">
          <Button onClick={() => setOpen(false)} className="w-full">
            Done
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}