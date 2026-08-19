"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Customer } from "../types/customer.types";
import { format } from "date-fns";

interface CustomerDetailDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: Customer | null;
  onEdit: (customer: Customer) => void;
}

export function CustomerDetailDrawer({ open, onOpenChange, customer, onEdit }: CustomerDetailDrawerProps) {
  if (!customer) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{customer.name}</SheetTitle>
        </SheetHeader>

        <div className="space-y-4 mt-6">
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p>{customer.email}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Phone</p>
            <p>{customer.phone}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Company</p>
            <p>{customer.company || "—"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <Badge variant={customer.status === "active" ? "default" : "secondary"}>
              {customer.status}
            </Badge>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Last Contact</p>
            <p>{format(new Date(customer.lastContactDate), "MMM d, yyyy")}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Created</p>
            <p>{format(new Date(customer.createdDate), "MMM d, yyyy")}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Notes</p>
            <p className="whitespace-pre-wrap">{customer.notes || "No notes yet."}</p>
          </div>

          <Button onClick={() => onEdit(customer)} className="w-full">
            Edit Customer
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}