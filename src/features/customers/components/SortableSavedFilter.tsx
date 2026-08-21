"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SavedFilter } from "../types/customer.types";

interface SortableSavedFilterProps {
  filter: SavedFilter;
  onApply: (filter: SavedFilter) => void;
  onDelete: (id: string) => void;
}

export function SortableSavedFilter({ filter, onApply, onDelete }: SortableSavedFilterProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: filter.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 rounded-md border px-2 py-1.5 bg-background"
    >
      {/* Drag handle — only this element triggers dragging, so buttons below stay clickable */}
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-muted-foreground touch-none"
        aria-label="Drag to reorder"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <button
        onClick={() => onApply(filter)}
        className="flex-1 text-left text-sm hover:underline"
      >
        {filter.name}
      </button>

      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6"
        onClick={() => onDelete(filter.id)}
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
}