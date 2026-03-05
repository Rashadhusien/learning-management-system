"use client";

import { CategoriesTable } from "@/components/tables/Admin/Categories/CategoriesTable";
import { Category } from "@/types/action.d";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteCategory } from "@/lib/actions/categories.action";
import { ROUTES } from "@/constants/routes";

interface CategoriesTableWrapperProps {
  data: Category[];
}

export function CategoriesTableWrapper({ data }: CategoriesTableWrapperProps) {
  const router = useRouter();

  const handleEdit = (category: Category) => {
    console.log("Edit category:", category);
    // Navigate to edit page
    router.push(ROUTES.ADMIN_EDIT_CATEGORY(category.id));
  };

  const handleDelete = async (category: Category) => {
    console.log("Delete category:", category);

    if (confirm(`Are you sure you want to delete "${category.name}"?`)) {
      try {
        const result = await deleteCategory(category.id);
        if (result.success) {
          toast.success("Success", {
            description: "Category deleted successfully",
          });
          // Refresh the page to show updated data
          router.refresh();
        } else {
          toast.error("Error", {
            description: result.error?.message || "Failed to delete category",
          });
        }
      } catch (error) {
        console.error("Error deleting category:", error);
        toast.error("Error", {
          description: "Failed to delete category",
        });
      }
    }
  };

  return (
    <CategoriesTable data={data} onEdit={handleEdit} onDelete={handleDelete} />
  );
}
