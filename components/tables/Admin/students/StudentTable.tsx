"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import {
  createActionsColumn,
  createEditAction,
  createDeleteAction,
  createViewAction,
} from "@/components/ui/table-columns";
import { User } from "@/types/action";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { CLOUDINARY_CLOUD_NAME } from "@/constants";
import { CldImage } from "next-cloudinary";

export function StudentTable({
  data,
  onView,
  onEdit,
  onDelete,
}: {
  data: User[];
  onView?: (student: User) => void;
  onEdit?: (student: User) => void;
  onDelete?: (student: User) => void;
}) {
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "imageCldPubId",
      header: "Image",
      cell: ({ row }) => {
        return (
          <div className="max-w-xs">
            <CldImage
              src={row.getValue("imageCldPubId")}
              alt="Student Avatar"
              className="w-10 h-10 rounded-full object-cover"
              width={40}
              height={40}
            />
          </div>
        );
      },
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        return (
          <div className="max-w-xs">
            <span className="font-medium">{row.getValue("name")}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => {
        return <div className="max-w-xs truncate">{row.getValue("email")}</div>;
      },
    },
    {
      accessorKey: "username",
      header: "Username",
      cell: ({ row }) => {
        return (
          <div className="max-w-xs truncate">{row.getValue("username")}</div>
        );
      },
    },
    {
      accessorKey: "level",
      header: "Level",
      cell: ({ row }) => {
        const level = row.getValue("level") as string;
        return <Badge variant="secondary">{level}</Badge>;
      },
    },
    {
      accessorKey: "active",
      header: "Active",
      cell: ({ row }) => {
        const active = row.getValue("active") as boolean;
        return active ? (
          <Badge variant="secondary">Active</Badge>
        ) : (
          <Badge variant="destructive">Inactive</Badge>
        );
      },
    },
    {
      accessorKey: "totalPoints",
      header: "Points",
      cell: ({ row }) => {
        const points = row.getValue("totalPoints") as number;
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
      searchKey="name"
      searchPlaceholder="Search students..."
      emptyMessage="No students found."
    />
  );
}
