import Hero from "@/components/Hero";
import { getAuthSession } from "@/lib/auth-wrapper";
import {
  getRecentCourses,
  getRecentProjects,
  getRecentStudents,
} from "@/lib/actions/stats.action";
import Features from "@/components/sections/Features";
import RecentStudent from "@/components/sections/RecentStudent";
import Stats from "@/components/sections/Stats";
import CourseCategories from "@/components/sections/CourseCategories";
import LearningPath from "@/components/sections/LearningPath";
import Testimonials from "@/components/sections/Testimonials";
import CTA from "@/components/sections/CTA";
import LatestProjects from "@/components/sections/LatestProjects";
import LatestCourses from "@/components/sections/LatestCourses";
import { getRecentCategories } from "@/lib/actions/categories.action";

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await getAuthSession();

  const [
    coursesResponse,
    projectsResponse,
    studentsResponse,
    categoriesResponse,
  ] = await Promise.all([
    getRecentCourses(),
    getRecentProjects(),
    getRecentStudents(),
    getRecentCategories(),
  ]);

  const courses =
    coursesResponse.success && coursesResponse.data
      ? coursesResponse.data.courses
      : [];
  const projects =
    projectsResponse.success && projectsResponse.data
      ? projectsResponse.data.projects
      : [];
  const students =
    studentsResponse.success && studentsResponse.data
      ? studentsResponse.data.students
      : [];

  const categories =
    categoriesResponse.success && categoriesResponse.data
      ? categoriesResponse.data
      : [];

  return (
    <main className="min-h-screen">
      <Hero />

      <Features />

      <LatestCourses courses={courses} />

      <LatestProjects projects={projects} />

      <RecentStudent students={students} />

      <Stats />

      <CourseCategories categories={categories} />

      <LearningPath />

      <Testimonials />

      <CTA session={session} />
    </main>
  );
}
