"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import {
  createActionsColumn,
  createStatusColumn,
  createDateColumn,
  createEditAction,
  createDeleteAction,
} from "@/components/ui/table-columns";
import { Category } from "@/types/action.d";
import { Badge } from "@/components/ui/badge";

export function CategoriesTable({
  data,
  onEdit,
  onDelete,
}: {
  data: Category[];
  onEdit?: (category: Category) => void;
  onDelete?: (category: Category) => void;
}) {
  const columns: ColumnDef<Category>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <span className="font-medium">{row.getValue("name")}</span>
            {row.original.icon && (
              <Badge variant="secondary" className="text-xs">
                {row.original.icon}
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => {
        const description = row.getValue("description") as string;
        return <div className="max-w-xs truncate">{description || "-"}</div>;
      },
    },
    createStatusColumn("isDeleted", (isDeleted) => ({
      label: isDeleted ? "Deleted" : "Active",
      className: isDeleted
        ? "bg-red-100 text-red-800 text-center"
        : "bg-green-100 text-green-800 text-center",
    })),
    createDateColumn("createdAt", "Created"),
    createActionsColumn([
      ...(onEdit ? [createEditAction(onEdit)] : []),
      ...(onDelete ? [createDeleteAction(onDelete)] : []),
    ]),
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey="name"
      searchPlaceholder="Search categories..."
      emptyMessage="No categories found."
    />
  );
}
