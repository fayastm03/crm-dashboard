import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Customer, SortConfig, SortableField } from "../types/customer.types";
import { format } from "date-fns";

interface CustomerTableProps {
  customers: Customer[];
  sort: SortConfig | null;
  onSortChange: (field: SortableField) => void;
  onRowClick: (customer: Customer) => void;
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
}

const columns: { field: SortableField; label: string }[] = [
  { field: "name", label: "Name" },
  { field: "email", label: "Email" },
  { field: "company", label: "Company" },
  { field: "lastContactDate", label: "Last Contact" },
];

export function CustomerTable({
  customers,
  sort,
  onSortChange,
  onRowClick,
  onEdit,
  onDelete,
}: CustomerTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((col) => (
            <TableHead
              key={col.field}
              className="cursor-pointer select-none"
              onClick={() => onSortChange(col.field)}
            >
              {col.label}
              {sort?.field === col.field && (sort.direction === "asc" ? " ↑" : " ↓")}
            </TableHead>
          ))}
          <TableHead>Phone</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {customers.map((customer) => (
          <TableRow
            key={customer.id}
            className="cursor-pointer"
            onClick={() => onRowClick(customer)}
          >
            <TableCell className="font-medium">{customer.name}</TableCell>
            <TableCell>{customer.email}</TableCell>
            <TableCell>{customer.company}</TableCell>
            <TableCell>{format(new Date(customer.lastContactDate), "MMM d, yyyy")}</TableCell>
            <TableCell>{customer.phone}</TableCell>
            <TableCell>
              <Badge variant={customer.status === "active" ? "default" : "secondary"}>
                {customer.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" onClick={() => onEdit(customer)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => onDelete(customer)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}