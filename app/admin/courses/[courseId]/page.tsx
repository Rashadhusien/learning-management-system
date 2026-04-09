import { Plus, BookOpen, FileText, Clock } from "lucide-react";
import { getCourseById } from "@/lib/actions/courses.action";
import { CourseWithLessons } from "@/types/action.d";
import { formatDuration } from "@/lib/utils";
import CreateChapterForm from "@/components/forms/admin/CreateChapterForm";
import { getCourseChapters } from "@/lib/actions/lectures.action";
import { Button } from "@base-ui/react";
import { notFound } from "next/navigation";
import AdminChapterCard from "@/components/cards/admin/AdminChapterCard";

interface CourseDetailsPageProps {
  params: Promise<{
    courseId: string;
  }>;
}

export default async function CourseDetailsPage({
  params,
}: CourseDetailsPageProps) {
  const { courseId } = await params;

  // Fetch course and chapters data on server side
  const [courseResult, chaptersResult] = await Promise.all([
    getCourseById(courseId),
    getCourseChapters(courseId),
  ]);

  // Handle errors
  if (!courseResult.success || !courseResult.data) {
    notFound();
  }

  if (!chaptersResult.success) {
    notFound();
  }

  const course = courseResult.data as CourseWithLessons;
  const chapters = chaptersResult.data;

  console.log(course, chapters);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Course Header */}
      <div className="bg-background border border-border/50 rounded-xl p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">
              {course.title}
            </h1>
            <p className="text-muted-foreground">{course.description}</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                {chapters?.length || 0} chapters
              </span>
              <span className="flex items-center gap-1">
                <FileText className="w-4 h-4" />
                {chapters?.reduce(
                  (acc, ch) => acc + (ch.lessons?.length || 0),
                  0,
                )}{" "}
                lessons
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {formatDuration(
                  course.lessons?.reduce((acc, ls) => acc + ls.duration, 0) ||
                    0,
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content Management */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            Course Content
          </h2>
          <CreateChapterForm courseId={courseId}>
            <Button className="flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-lg hover:opacity-90 transition-opacity">
              <Plus className="w-4 h-4" />
              Create Chapter
            </Button>
          </CreateChapterForm>
        </div>

        {/* Chapters List */}
        <div className="space-y-3">
          {chapters?.map((chapter, index) => {
            return (
              <AdminChapterCard
                chapter={chapter}
                chapterIndex={index}
                key={chapter.id}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
