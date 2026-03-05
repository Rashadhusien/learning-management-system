import DataRenderer from "@/components/DataRenderer";
import SectionTitle from "@/components/SectionTitle";
import CourseCard from "@/components/cards/CourseCard";
import { EMYPTY_COURSE } from "@/constants/states";
import { getAllCourses } from "@/lib/actions/courses.action";

const Projects = async () => {
  return (
    <section className="container mx-auto">
      <SectionTitle
        title="Academy Projects"
        description="Explore our collection of coding projects with their point values and completion stats"
      />
    </section>
  );
};

export default Projects;
