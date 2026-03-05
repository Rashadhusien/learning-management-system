import DataRenderer from "@/components/DataRenderer";
import SectionTitle from "@/components/SectionTitle";
import CourseCard from "@/components/cards/CourseCard";
import { EMYPTY_COURSE } from "@/constants/states";
import { getAllCourses } from "@/lib/actions/courses.action";

const Courses = async () => {
  const { success, data, error } = await getAllCourses();
  return (
    <section className="container mx-auto">
      <SectionTitle
        title="Explore Our Courses"
        description="Learn programming step-by-step with real-world examples and projects"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:mx-4">
        <DataRenderer
          success={success}
          data={data}
          empty={EMYPTY_COURSE}
          render={(data) =>
            data.map((course) => {
              return <CourseCard key={course.id} course={course} />;
            })
          }
        />
      </div>
    </section>
  );
};

export default Courses;
