import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { getAllCategories } from "@/lib/actions/categories.action";
import DataRenderer from "@/components/DataRenderer";
import { EMYPTY_CATEGORY } from "@/constants/states";
import { CategoriesTableWrapper } from "@/components/tables/Admin/Categories/CategoriesTableWrapper";

const AdminCategories = async () => {
  const categories = await getAllCategories();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Category Management</h1>
          <p className="text-muted-foreground">
            Manage your course categories and organize your content
          </p>
        </div>
        <Link href="/admin/categories/create">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Category
          </Button>
        </Link>
      </div>

      {/* Categories Table */}
      <DataRenderer
        success={categories.success}
        error={categories.error}
        data={categories.data}
        empty={EMYPTY_CATEGORY}
        render={(data) => <CategoriesTableWrapper data={data} />}
      />
    </div>
  );
};

export default AdminCategories;
