"use client";

import { User } from "@/types/action";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  deleteStudent,
  toggleStudentActive,
} from "@/lib/actions/students.action";
import { StudentTable } from "./StudentTable";

interface StudentTableWrapperProps {
  data: User[];
}

export function StudentTableWrapper({ data }: StudentTableWrapperProps) {
  const router = useRouter();

  const handleEdit = (student: User) => {
    console.log("Edit student:", student);
    // Navigate to edit page
    router.push(`/admin/students/${student.id}/edit`);
  };

  const handleDelete = async (student: User) => {
    console.log("Delete student:", student);

    if (confirm(`Are you sure you want to delete "${student.name}"?`)) {
      try {
        const result = await deleteStudent(student.id);
        if (result.success) {
          toast.success("Success", {
            description: "Student deleted successfully",
          });
          // Refresh the page to show updated data
          router.refresh();
        } else {
          toast.error("Error", {
            description: result.error || "Failed to delete student",
          });
        }
      } catch (error) {
        console.error("Error deleting student:", error);
        toast.error("Error", {
          description: "Failed to delete student",
        });
      }
    }
  };

  const toggleActive = async (student: User) => {
    console.log("Toggle active:", student);
    try {
      const result = await toggleStudentActive(student.id);
      if (result.success) {
        toast.success("Success", {
          description: "Student active status toggled successfully",
        });
        // Refresh the page to show updated data
        router.refresh();
      } else {
        toast.error("Error", {
          description: result.error || "Failed to toggle active",
        });
      }
    } catch (error) {
      console.error("Error toggling active:", error);
      toast.error("Error", {
        description: "Failed to toggle active",
      });
    }
  };

  return (
    <StudentTable
      data={data}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onToggleActive={toggleActive}
    />
  );
}
