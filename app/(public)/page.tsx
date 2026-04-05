import Hero from "@/components/Hero";
import { getAuthSession } from "@/lib/auth-wrapper";
import {
  getRecentCourses,
  getRecentProjects,
  getRecentStudents,
} from "@/lib/actions/stats.action";
import Features from "@/components/sections/Features";
import LatestProjectsAndCourses from "@/components/sections/LatestProjectsAndCourses";
import RecentStudent from "@/components/sections/RecentStudent";
import Stats from "@/components/sections/Stats";
import CourseCategories from "@/components/sections/CourseCategories";
import LearningPath from "@/components/sections/LearningPath";
import Testimonials from "@/components/sections/Testimonials";
import CTA from "@/components/sections/CTA";
import GlobalReach from "@/components/sections/GlobalReach";

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await getAuthSession();

  const [coursesResponse, projectsResponse, studentsResponse] =
    await Promise.all([
      getRecentCourses(),
      getRecentProjects(),
      getRecentStudents(),
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

  return (
    <main className="min-h-screen">
      <Hero />

      {/* Features Section */}
      <Features />

      {/* Latest Projects & Courses */}
      <LatestProjectsAndCourses projects={projects} courses={courses} />

      {/* Recent Students Section */}
      <RecentStudent students={students} />

      {/* Stats Section */}
      <Stats />
      {/* Course Categories */}
      <CourseCategories />
      {/* Learning Path Section */}
      <LearningPath />

      {/* Testimonials */}
      <Testimonials />

      {/* CTA Section */}
      <CTA session={session} />

      {/* Global Reach Section */}
      <GlobalReach />
    </main>
  );
}
