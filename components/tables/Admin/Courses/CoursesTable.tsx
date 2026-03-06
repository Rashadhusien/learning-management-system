"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import {
  createActionsColumn,
  createStatusColumn,
  createDateColumn,
  createCurrencyColumn,
  createEditAction,
  createDeleteAction,
  createViewAction,
} from "@/components/ui/table-columns";
import { Course } from "@/types/action.d";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import {
  getLevelConfig,
  getCategoryConfig,
  getStatusConfig,
} from "@/constants/colors";

export function CoursesTable({
  data,
  onView,
  onEdit,
  onDelete,
}: {
  data: Course[];
  onView?: (course: Course) => void;
  onEdit?: (course: Course) => void;
  onDelete?: (course: Course) => void;
}) {
  const columns: ColumnDef<Course>[] = [
    {
      accessorKey: "bannerUrl",
      header: "Image",
      cell: ({ row }) => {
        return (
          <div className="max-w-xs">
            <Image
              src={row.getValue("bannerUrl")}
              alt="Course Banner"
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
        return (
          <div className="max-w-xs truncate">
            {description || "No description"}
          </div>
        );
      },
    },
    {
      accessorKey: "level",
      header: "Level",
      cell: ({ row }) => {
        const level = row.getValue("level") as string;
        const levelConfig = getLevelConfig(level);
        return (
          <Badge
            variant={levelConfig.badgeVariant}
            className={levelConfig.color}
          >
            <span className="flex items-center gap-1">
              <span>{levelConfig.name}</span>
            </span>
          </Badge>
        );
      },
    },
    {
      accessorKey: "category.name",
      header: "Category",
      cell: ({ row }) => {
        const category = row.original.category;
        if (!category) return <Badge variant="outline">No Category</Badge>;

        const categoryConfig = getCategoryConfig(category.name);
        return (
          <Badge variant="outline" className={categoryConfig.color}>
            <span className="flex items-center gap-1">
              <span>{category.name}</span>
            </span>
          </Badge>
        );
      },
    },
    createCurrencyColumn("price"),
    {
      accessorKey: "duration",
      header: "Duration",
      cell: ({ row }) => {
        const duration = row.getValue("duration") as number;
        return `${duration}h`;
      },
    },
    createStatusColumn("isPublished", (isPublished) => {
      const statusConfig = getStatusConfig(isPublished as boolean);
      return {
        label: statusConfig.name,
        className: statusConfig.color,
      };
    }),
    createDateColumn("createdAt", "Created"),
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
      searchPlaceholder="Search courses..."
      emptyMessage="No courses found."
    />
  );
}
