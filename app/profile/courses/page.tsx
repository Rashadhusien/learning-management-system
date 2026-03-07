import DataRenderer from "@/components/DataRenderer";
import CourseCard from "@/components/cards/CourseCard";
import { Card } from "@/components/ui/card";
import { EMYPTY_COURSE } from "@/constants/states";
import { getStudentCourses } from "@/lib/actions/courses.action";

const ProfileCourses = async (searchParams: {
  page?: string;
  pageSize?: string;
}) => {
  const page = Number(searchParams.page) || 1;
  const pageSize = Number(searchParams.pageSize) || 10;
  const { success, error, data, pagination } = await getStudentCourses({
    page,
    pageSize,
  });
  return (
    <section className="p-6">
      <Card className="mt-8">
        <div className="p-6">
          <h2 className="text-2xl md:text-3xl font-semibold">My Courses</h2>
          <p className="text-muted-foreground mt-2">
            You can always track your progress and manage your courses here
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6  mt-10">
          <DataRenderer
            success={success}
            error={typeof error === "string" ? { message: error } : error}
            data={data}
            empty={EMYPTY_COURSE}
            render={(data) =>
              data.map((course) => {
                return <CourseCard key={course.id} course={course} />;
              })
            }
          />
        </div>
      </Card>
    </section>
  );
};

export default ProfileCourses;
