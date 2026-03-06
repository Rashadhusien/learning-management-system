"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import {
  createActionsColumn,
  createEditAction,
  createDeleteAction,
  createViewAction,
} from "@/components/ui/table-columns";
import { Project } from "@/types/action.d";
import { Badge } from "@/components/ui/badge";
import { CldImage } from "next-cloudinary";

export function ProjectsTable({
  data,
  onView,
  onEdit,
  onDelete,
}: {
  data: Project[];
  onView?: (project: Project) => void;
  onEdit?: (project: Project) => void;
  onDelete?: (project: Project) => void;
}) {
  const columns: ColumnDef<Project>[] = [
    {
      accessorKey: "imageCldPubId",
      header: "Image",
      cell: ({ row }) => {
        return (
          <div className="max-w-xs">
            <CldImage
              src={row.getValue("imageCldPubId")}
              alt="Project Banner"
              className="w-10 h-10 rounded-sm scale-105 object-cover"
              width={40}
              height={40}
            />
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
        return <div className="max-w-xs truncate">{description || "N/A"}</div>;
      },
    },
    {
      accessorKey: "points",
      header: "Points",
      cell: ({ row }) => {
        const points = row.getValue("points") as number;
        return <Badge variant="secondary">{points} pts</Badge>;
      },
    },
    {
      accessorKey: "courseTitle",
      header: "Course",
      cell: ({ row }) => {
        const courseTitle = row.getValue("courseTitle") as string;
        return <div className="max-w-xs truncate">{courseTitle || "N/A"}</div>;
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
      searchPlaceholder="Search projects..."
      emptyMessage="No projects found."
    />
  );
}
