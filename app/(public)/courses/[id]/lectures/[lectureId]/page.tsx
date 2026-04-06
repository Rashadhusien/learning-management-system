// app/(student)/courses/[courseId]/lessons/[lessonId]/page.tsx

import LecturePlayer from "@/components/lectures/LecturePlayer";
import { rockPaperScissorsCourse } from "@/data/sample-course";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ courseId: string; lectureId: string }>;
}

export default async function LessonPage({ params }: Props) {
  const { courseId, lectureId } = await params;
  const course = rockPaperScissorsCourse; // replace with your DB fetch
  const lesson = course.lessons?.find((l) => l.id === lectureId);
  console.log(courseId, lectureId);
  if (!lesson) notFound();

  const currentIndex =
    course.lessons
      ?.sort((a, b) => a.order - b.order)
      .findIndex((l) => l.id === lectureId) ?? -1;

  const prevLesson = course.lessons?.[currentIndex - 1] ?? null;
  const nextLesson = course.lessons?.[currentIndex + 1] ?? null;

  return (
    <LecturePlayer
      course={course}
      currentLesson={lesson}
      prevLesson={prevLesson}
      nextLesson={nextLesson}
    />
  );
}
