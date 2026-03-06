import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import DataRenderer from "@/components/DataRenderer";
import { EMYPTY_COURSE } from "@/constants/states";
import { getAllProjects } from "@/lib/actions/projects.action";
import { ProjectTableWrapper } from "@/components/tables/Admin/projects/ProjectsTableWrapper";

const AdminProjects = async () => {
  const projects = await getAllProjects({
    page: 1,
    pageSize: 10,
  });
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

      <DataRenderer
        success={projects.success}
        error={projects.error ? { message: projects.error } : undefined}
        data={projects.data}
        empty={EMYPTY_COURSE}
        render={(data) => <ProjectTableWrapper data={data} />}
      />
    </div>
  );
};

export default AdminProjects;
