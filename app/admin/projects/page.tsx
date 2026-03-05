import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { getAllCourses } from "@/lib/actions/courses.action";
import DataRenderer from "@/components/DataRenderer";
import { EMYPTY_COURSE } from "@/constants/states";
import { CoursesTableWrapper } from "@/components/tables/Admin/Courses/CoursesTableWrapper";

const AdminProjects = async () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects Management</h1>
          <p className="text-muted-foreground">
            Manage your projects, content, and student enrollment
          </p>
        </div>

        <Link href="/admin/projects/create">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Project
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default AdminProjects;
