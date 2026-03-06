import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { getAllCourses } from "@/lib/actions/courses.action";
import DataRenderer from "@/components/DataRenderer";
import { EMYPTY_COURSE } from "@/constants/states";
import { CoursesTableWrapper } from "@/components/tables/Admin/Courses/CoursesTableWrapper";

const AdminCourses = async () => {
  const courses = await getAllCourses({
    page: 1,
    pageSize: 10,
  });

  console.log(courses);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Course Management</h1>
          <p className="text-muted-foreground">
            Manage your courses, content, and student enrollment
          </p>
        </div>

        <Link href="/admin/courses/create">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Course
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Courses
                </p>
                <p className="text-2xl font-bold">{courses.length}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Star className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Published
                </p>
                <p className="text-2xl font-bold">
                  {courses.filter((c) => c.status === "published").length}
                </p>
              </div>
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <Users className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Students
                </p>
                <p className="text-2xl font-bold">
                  {courses
                    .reduce((sum, c) => sum + c.enrolledCount, 0)
                    .toLocaleString()}
                </p>
              </div>
              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                <Users className="h-4 w-4 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Avg Rating
                </p>
                <p className="text-2xl font-bold">
                  {(
                    courses.reduce((sum, c) => sum + c.rating, 0) /
                    courses.length
                  ).toFixed(1)}
                </p>
              </div>
              <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                <Star className="h-4 w-4 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div> */}
      <DataRenderer
        success={courses.success}
        error={courses.error}
        data={courses.data}
        empty={EMYPTY_COURSE}
        render={(data) => <CoursesTableWrapper data={data} />}
      />
    </div>
  );
};

export default AdminCourses;
