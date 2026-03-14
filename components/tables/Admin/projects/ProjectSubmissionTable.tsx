"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import {
  createActionsColumn,
  createViewAction,
} from "@/components/ui/table-columns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLinkIcon, CheckIcon, XIcon } from "lucide-react";
import UserAvatar from "@/components/UserAvatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ProjectSubmission = {
  student: {
    id: string;
    name: string;
    username: string;
    email: string;
    image?: string;
    totalPoints: number;
  };
  submission: {
    id: string;
    repoLink: string | null;
    demoLink: string | null;
    status: "pending" | "approved" | "rejected";
    pointsEarned: number | null;
    submittedAt: Date;
  };
  project: {
    id: string;
    title: string;
    imageCldPubId?: string;
  };
  totalProjects: number;
};

export function ProjectSubmissionTable({
  data,
  onView,
  onStatusChange,
}: {
  data: ProjectSubmission[];
  onView?: (submission: ProjectSubmission) => void;
  onStatusChange?: (submission: ProjectSubmission) => void;
}) {
  const columns: ColumnDef<ProjectSubmission>[] = [
    {
      id: "student",
      header: "Student",
      cell: ({ row }) => {
        const student = row.original.student;
        return (
          <div className="flex items-center gap-3">
            <UserAvatar imageUrl={student.image} name={student.name} />
            <div>
              <div className="font-medium truncate max-w-xs">
                {student.name}
              </div>
              <div className="text-xs text-muted-foreground">
                @{student.username}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      id: "project",
      header: "Project",
      cell: ({ row }) => {
        const project = row.original.project;
        return (
          <div className="flex items-center gap-3">
            <UserAvatar imageUrl={project.imageCldPubId} name={project.title} />

            <div>
              <div className="font-medium truncate max-w-xs">
                {project.title}
              </div>
            </div>
          </div>
        );
      },
    },

    {
      id: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.submission.status;

        return (
          <Select
            value={status}
            onValueChange={(value) =>
              onStatusChange?.({
                ...row.original,
                submission: {
                  ...row.original.submission,
                  status: value as "pending" | "approved" | "rejected",
                },
              })
            }
          >
            <SelectTrigger className="w-full max-w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        );
      },
    },

    {
      id: "submittedAt",
      header: "Submitted At",
      cell: ({ row }) => {
        const submittedAt = row.original.submission.submittedAt;
        return (
          <span className="text-sm">{submittedAt.toLocaleDateString()}</span>
        );
      },
    },
    {
      id: "links",
      header: "Links",
      cell: ({ row }) => {
        const { repoLink, demoLink } = row.original.submission;
        return (
          <div className="flex items-center gap-2">
            {repoLink && (
              <Button variant="outline" size="sm" asChild>
                <a
                  href={repoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1"
                >
                  <ExternalLinkIcon className="w-3 h-3" />
                  Repo
                </a>
              </Button>
            )}
            {demoLink && (
              <Button variant="outline" size="sm" asChild>
                <a
                  href={demoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1"
                >
                  <ExternalLinkIcon className="w-3 h-3" />
                  Demo
                </a>
              </Button>
            )}
          </div>
        );
      },
    },
    // createActionsColumn([
    //   ...(onView ? [createViewAction(onView)] : []),
    //   ...(onApprove
    //     ? [
    //         {
    //           label: "Approve",
    //           onClick: onApprove,
    //           icon: <CheckIcon className="w-4 h-4" />,
    //           variant: "default" as const,
    //         },
    //       ]
    //     : []),
    //   ...(onReject
    //     ? [
    //         {
    //           label: "Reject",
    //           onClick: onReject,
    //           icon: <XIcon className="w-4 h-4" />,
    //           variant: "destructive" as const,
    //         },
    //       ]
    //     : []),
    // ]),
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey="student"
      searchPlaceholder="Search students..."
      emptyMessage="No project submissions found."
    />
  );
}
