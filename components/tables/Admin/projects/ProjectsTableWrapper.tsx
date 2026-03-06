"use client";

import { Project } from "@/types/action.d";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteCourse } from "@/lib/actions/courses.action";
import { ProjectsTable } from "./ProjectsTable";

interface ProjectTableWrapperProps {
  data: Project[];
}

export function ProjectTableWrapper({ data }: ProjectTableWrapperProps) {
  const router = useRouter();

  const handleEdit = (project: Project) => {
    console.log("Edit course:", project);
    // Navigate to edit page
    router.push(`/admin/projects/${project.id}/edit`);
  };

  const handleDelete = async (project: Project) => {
    console.log("Delete course:", project);

    if (confirm(`Are you sure you want to delete "${project.title}"?`)) {
      try {
        const result = await deleteCourse(project.id);
        if (result.success) {
          toast.success("Success", {
            description: "Course deleted successfully",
          });
          // Refresh the page to show updated data
          router.refresh();
        } else {
          toast.error("Error", {
            description: result.error?.message || "Failed to delete course",
          });
        }
      } catch (error) {
        console.error("Error deleting course:", error);
        toast.error("Error", {
          description: "Failed to delete course",
        });
      }
    }
  };

  return (
    <ProjectsTable data={data} onEdit={handleEdit} onDelete={handleDelete} />
  );
}
