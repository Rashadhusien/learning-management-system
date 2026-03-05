"use client";

import { CoursesTable } from "@/components/tables/Admin/Courses/CoursesTable";
import { Course } from "@/types/action.d";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteCourse } from "@/lib/actions/courses.action";

interface CoursesTableWrapperProps {
  data: Course[];
}

export function CoursesTableWrapper({ data }: CoursesTableWrapperProps) {
  const router = useRouter();

  const handleView = (course: Course) => {
    console.log("View course:", course);
    // Navigate to course details page
    router.push(`/courses/${course.id}`);
  };

  const handleEdit = (course: Course) => {
    console.log("Edit course:", course);
    // Navigate to edit page
    router.push(`/admin/courses/${course.id}/edit`);
  };

  const handleDelete = async (course: Course) => {
    console.log("Delete course:", course);

    if (confirm(`Are you sure you want to delete "${course.title}"?`)) {
      try {
        const result = await deleteCourse(course.id);
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
    <CoursesTable
      data={data}
      onView={handleView}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
}
