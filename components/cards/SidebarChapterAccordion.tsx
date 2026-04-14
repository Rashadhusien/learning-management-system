import { CourseChapter } from "@/types/action";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { cn, formatDuration } from "@/lib/utils";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { Video, FileText, CheckCircle, Code } from "lucide-react";

const lessonIconMap = {
  video: Video,
  text: FileText,
  project: Code,
  quiz: CheckCircle,
  assignment: FileText,
} as const;

const SidebarChapterAccordion = ({
  chapter,
  courseId,
  currentLessonId,
}: {
  chapter: CourseChapter;
  courseId: string;
  currentLessonId?: string;
}) => {
  const lessons = chapter.lessons ?? [];
  const completedCount = lessons.filter((l) => l.completed).length;
  const hasActiveLesson = lessons.some((l) => l.id === currentLessonId);

  return (
    <Accordion
      key={chapter.id}
      type="single"
      collapsible
      defaultValue={hasActiveLesson ? chapter.id : undefined}
      className="rounded-none border-none no-line no-p"
    >
      <AccordionItem
        value={chapter.id}
        className="border-b border-border/20 no-line no-p"
      >
        {/* Chapter trigger */}
        <AccordionTrigger className="group w-full no-line   active:no-underline p-0 hover:no-underline no-underline! flex items-center gap-2.5 px-3.5 py-3 hover:bg-muted/30 transition-colors text-left data-[state=open]:bg-muted/20">
          {/* Chapter number badge */}
          <div
            className={cn(
              "w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-medium shrink-0 transition-colors",
              hasActiveLesson
                ? "border-primary/40 bg-primary/10 text-primary"
                : "border-border/50 text-muted-foreground",
            )}
          >
            {chapter.order + 1}
          </div>

          {/* Chapter info */}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground leading-tight">
              {chapter.title}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <p className="text-[10px] text-muted-foreground">
                {lessons.length} lessons
              </p>
              {completedCount > 0 && (
                <>
                  <span className="text-[10px] text-muted-foreground/40">
                    ·
                  </span>
                  <p className="text-[10px] text-emerald-500/80">
                    {completedCount}/{lessons.length} done
                  </p>
                </>
              )}
            </div>
          </div>
        </AccordionTrigger>

        {/* Lessons list */}
        <div className="border-t border-border/15">
          {lessons.map((lesson) => {
            const isActive = lesson.id === currentLessonId;
            const isCompleted = lesson.completed;
            const LIcon = lessonIconMap[lesson.lessonType] ?? FileText;

            return (
              <AccordionContent key={lesson.id} className="p-0">
                <Link
                  href={ROUTES.LESSON(courseId, lesson.id)}
                  className={cn(
                    "group/lesson relative flex items-center gap-2.5 px-3.5 py-2.5 w-full border-b border-border/10 last:border-0 transition-colors",
                    isActive ? "bg-primary/8" : "hover:bg-muted/25",
                  )}
                >
                  {/* Active left bar */}
                  {isActive && (
                    <span className="absolute left-0 top-1 bottom-1 w-[3px] rounded-r-full bg-primary" />
                  )}

                  {/* Status dot */}
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full border-[1.5px] shrink-0 transition-all",
                      isActive
                        ? "bg-primary border-primary"
                        : isCompleted
                          ? "bg-emerald-500 border-emerald-500"
                          : "border-border/50",
                    )}
                  />

                  {/* Type icon pill */}
                  <div
                    className={cn(
                      "w-[22px] h-[22px] rounded-md flex items-center justify-center shrink-0 transition-colors",
                      isActive ? "bg-primary/15" : "bg-muted/50",
                    )}
                  >
                    <LIcon
                      className={cn(
                        "w-2.5 h-2.5",
                        isActive ? "text-primary" : "text-muted-foreground",
                      )}
                    />
                  </div>

                  {/* Title + duration */}
                  <div className="flex-1 flex justify-between items-center min-w-0 gap-2">
                    <p
                      className={cn(
                        "text-[11.5px] leading-tight truncate",
                        isActive
                          ? "font-medium text-primary"
                          : isCompleted
                            ? "text-muted-foreground/60 line-through decoration-muted-foreground/30"
                            : "text-muted-foreground",
                      )}
                    >
                      {lesson.title}
                    </p>
                    <p
                      className={cn(
                        "text-[10px] shrink-0",
                        isActive
                          ? "text-primary/70"
                          : "text-muted-foreground/50",
                      )}
                    >
                      {formatDuration(lesson.duration)}
                    </p>
                  </div>
                </Link>
              </AccordionContent>
            );
          })}
        </div>
      </AccordionItem>
    </Accordion>
  );
};

export default SidebarChapterAccordion;
