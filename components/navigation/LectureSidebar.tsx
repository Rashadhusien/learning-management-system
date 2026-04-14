import SidebarChapterAccordion from "../cards/SidebarChapterAccordion";
import { CourseChapter } from "@/types/action";

const LectureSidebar = ({
  chapters,
  courseId,
  currentLessonId,
}: {
  chapters: CourseChapter[];
  courseId: string;
  currentLessonId?: string;
}) => {
  return (
    <aside className="w-80 shrink-0 border-l border-border/50 flex flex-col overflow-hidden">
      {/* Sticky header */}
      <div className="px-4 py-3 border-b border-border/50 flex items-center justify-between shrink-0 bg-background">
        <span className="text-sm font-medium text-foreground">
          Course content
        </span>
        <div className="flex items-center gap-2">
          {/* <div className="w-12 h-1 bg-border/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-foreground/40 rounded-full transition-all duration-500"
              style={{
                width: `${((lessonIndex + 1) / totalLessons) * 100}%`,
              }}
            />
          </div> */}
          {/* <span className="text-[11px] text-muted-foreground">
            {lessonIndex + 1}/{totalLessons}
          </span> */}
        </div>
      </div>

      {/* Chapters + lessons */}
      <div className="overflow-y-auto flex-1">
        {chapters.map((chapter) => {
          return (
            <SidebarChapterAccordion
              key={chapter.id}
              chapter={chapter}
              courseId={courseId}
              currentLessonId={currentLessonId}
            />
          );
        })}
      </div>
    </aside>
  );
};

export default LectureSidebar;
