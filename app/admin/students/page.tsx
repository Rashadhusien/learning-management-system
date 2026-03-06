import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import DataRenderer from "@/components/DataRenderer";
import { EMYPTY_COURSE } from "@/constants/states";
import { getAllStudents } from "@/lib/actions/students.action";
import { StudentTableWrapper } from "@/components/tables/Admin/students/StudentTableWrapper";

const AdminStudents = async () => {
  const projects = await getAllStudents({
    page: 1,
    pageSize: 10,
  });
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Students Management</h1>
          <p className="text-muted-foreground">
            Manage your students and their enrollments
          </p>
        </div>

        <Link href="/admin/students/create">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Student
          </Button>
        </Link>
      </div>

      <DataRenderer
        success={projects.success}
        error={projects.error ? { message: projects.error } : undefined}
        data={projects.data}
        empty={EMYPTY_COURSE}
        render={(data) => <StudentTableWrapper data={data} />}
      />
    </div>
  );
};

export default AdminStudents;
