import { UserX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

export function EmptyState({ hasActiveFilters, onClearFilters }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <UserX className="h-10 w-10 text-muted-foreground mb-3" />
      <p className="font-medium">No customers found</p>
      <p className="text-sm text-muted-foreground mt-1 max-w-sm">
        {hasActiveFilters
          ? "No customers match your current search or filters."
          : "There are no customers yet — add your first one to get started."}
      </p>
      {hasActiveFilters && (
        <Button variant="outline" size="sm" className="mt-4" onClick={onClearFilters}>
          Clear filters
        </Button>
      )}
    </div>
  );
}