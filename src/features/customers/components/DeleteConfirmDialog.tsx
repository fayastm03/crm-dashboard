"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Customer } from "../types/customer.types";
import { useDeleteCustomer } from "../api/customer.queries";
import { useToast } from "@/hooks/use-toast";

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: Customer | null;
}

export function DeleteConfirmDialog({ open, onOpenChange, customer }: DeleteConfirmDialogProps) {
  const deleteMutation = useDeleteCustomer();
  const { toast } = useToast();

  async function handleConfirm() {
    if (!customer) return;
    try {
      await deleteMutation.mutateAsync(customer.id);
      toast({ title: "Customer deleted", description: `${customer.name} was removed.` });
      onOpenChange(false);
    } catch (err) {
      toast({
        title: "Failed to delete",
        description: (err as Error).message,
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Delete Customer</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {customer?.name}? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={deleteMutation.isPending}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={deleteMutation.isPending}>
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}