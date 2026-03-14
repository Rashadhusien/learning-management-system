"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ProjectSubmissionTable } from "./ProjectSubmissionTable";
import { updateProjectSubmissionStatus } from "@/lib/actions/project-submissions.action";
import { useState } from "react";

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

interface ProjectSubmissionTableWrapperProps {
  data: ProjectSubmission[];
}

export function ProjectSubmissionTableWrapper({
  data,
}: ProjectSubmissionTableWrapperProps) {
  const router = useRouter();

  const handleViewSubmission = (submission: ProjectSubmission) => {
    console.log("View submission:", submission);
    // Navigate to submission details page
    router.push(`/admin/projects/submissions/${submission.submission.id}`);
  };

  const updateStatus = async (submission: ProjectSubmission) => {
    try {
      const result = await updateProjectSubmissionStatus(submission);

      if (result.success) {
        toast.success("Success", {
          description: "Submission updated successfully",
        });
        router.refresh();
      } else {
        toast.error("Error", {
          description: result.error || "Failed to update submission status",
        });
      }
    } catch (error) {
      console.error("Error updating submission status:", error);
      toast.error("Error", {
        description: "Failed to update submission status",
      });
    }
  };

  return (
    <ProjectSubmissionTable
      data={data}
      onView={handleViewSubmission}
      onStatusChange={updateStatus}
    />
  );
}
