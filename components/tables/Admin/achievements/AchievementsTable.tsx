"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import {
  createActionsColumn,
  createEditAction,
  createDeleteAction,
  createViewAction,
} from "@/components/ui/table-columns";
import { Achievement } from "@/types/action";
import { Badge } from "@/components/ui/badge";
import { CldImage } from "next-cloudinary";

export function AchievementsTable({
  data,
  onView,
  onEdit,
  onDelete,
}: {
  data: Achievement[];
  onView?: (achievement: Achievement) => void;
  onEdit?: (achievement: Achievement) => void;
  onDelete?: (achievement: Achievement) => void;
}) {
  const columns: ColumnDef<Achievement>[] = [
    {
      accessorKey: "imageCldPubId",
      header: "Image",
      cell: ({ row }) => {
        const imageCldPubId = row.getValue("imageCldPubId") as string;
        return (
          <div className="max-w-xs">
            {imageCldPubId ? (
              <CldImage
                src={imageCldPubId}
                alt="Achievement Icon"
                className="w-10 h-10 rounded-lg object-cover"
                width={40}
                height={40}
              />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500 text-xs">🏆</span>
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => {
        return (
          <div className="max-w-xs">
            <span className="font-medium">{row.getValue("title")}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => {
        const description = row.getValue("description") as string;
        return (
          <div className="max-w-xs truncate">
            {description || "No description"}
          </div>
        );
      },
    },
    {
      accessorKey: "requiredPoints",
      header: "Points Required",
      cell: ({ row }) => {
        const points = row.getValue("requiredPoints") as number;
        return <Badge variant="outline">{points} pts</Badge>;
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => {
        const date = row.getValue("createdAt") as Date;
        return date.toLocaleDateString();
      },
    },

    createActionsColumn([
      ...(onView ? [createViewAction(onView)] : []),
      ...(onEdit ? [createEditAction(onEdit)] : []),
      ...(onDelete ? [createDeleteAction(onDelete)] : []),
    ]),
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey="title"
      searchPlaceholder="Search achievements..."
      emptyMessage="No achievements found."
    />
  );
}
