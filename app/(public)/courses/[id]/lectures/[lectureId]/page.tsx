// app/(student)/courses/[courseId]/lessons/[lessonId]/page.tsx

import LectrueContent from "@/components/lectures/lectrue-content";
import LectureSidebar from "@/components/navigation/LectureSidebar";
import { getCourseById } from "@/lib/actions/courses.action";
import {
  getCourseLectures,
  getLectureById,
  getCourseChapters,
} from "@/lib/actions/lectures.action";
import { notFound } from "next/navigation";
import { CourseWithLessons } from "@/types/action";

interface Props {
  params: Promise<{ id: string; lectureId: string }>;
}

export default async function LessonPage({ params }: Props) {
  const { id: courseId, lectureId } = await params;

  // Fetch the specific lecture
  const lectureResult = await getLectureById(lectureId);

  const { data: lesson } = lectureResult;

  // Fetch course, lessons, and chapters for navigation
  const courseResult = await getCourseById(courseId);
  const lessonsResult = await getCourseLectures(courseId);
  const chaptersResult = await getCourseChapters(courseId);

  const course = courseResult.success ? courseResult.data : null;
  const lessons = lessonsResult.success ? lessonsResult.data : null;
  const chapters = chaptersResult.success ? chaptersResult.data : null;

  if (!chapters || !course || !lesson) {
    notFound();
  }

  // Construct CourseWithLessons data structure
  const courseWithLessons: CourseWithLessons = {
    ...course,
    chapters,
    lessons: lessons || undefined,
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-background">
      {/* ── Sidebar ─────────────────────────────────────────────────── */}
      <div className="w-80 shrink-0 border-r border-border/50">
        <LectureSidebar
          chapters={chapters}
          courseId={courseId}
          currentLessonId={lectureId}
        />
      </div>

      {/* ── Main Content ─────────────────────────────────────────────── */}
      <div className="flex-1 min-w-0">
        <LectrueContent course={courseWithLessons} currentLesson={lesson} />
      </div>
    </div>
  );
}
