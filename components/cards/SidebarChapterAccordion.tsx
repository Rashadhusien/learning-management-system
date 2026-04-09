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
  return (
    <Accordion
      key={chapter.id}
      type="single"
      collapsible
      className="rounded-none border-none "
    >
      {/* Chapter header */}
      <AccordionItem
        value={chapter.id}
        className="border-b border-muted/20 p-0! "
      >
        <AccordionTrigger className="w-full p-0 hover:no-underline no-underline! flex items-center gap-2.5 px-4 py-3 hover:bg-muted/30 transition-colors text-left">
          <div className="w-5 h-5 rounded-full border border-border/60 flex items-center justify-center text-[10px] font-medium text-muted-foreground shrink-0">
            {chapter.order + 1}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground">
              {chapter.title}
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              {lessons.length} lessons
            </p>
          </div>
        </AccordionTrigger>

        {lessons.map((lesson) => {
          const isActive = currentLessonId
            ? lesson.id === currentLessonId
            : false;
          const LIcon =
            {
              video: Video,
              text: FileText,
              project: Code,
              quiz: CheckCircle,
              assignment: FileText,
            }[lesson.lessonType] ?? FileText;

          return (
            <AccordionContent key={lesson.id}>
              <Link
                href={ROUTES.LESSON(courseId, lesson.id)}
                className={cn(
                  "flex items-center gap-2.5 p-3 w-full rounded-sm   last:border-0 transition-colors",
                  isActive ? "bg-muted/50" : "hover:bg-muted/20",
                )}
              >
                {/* Status dot */}
                <div
                  className={cn(
                    "w-3 h-3 rounded-full border shrink-0",
                    isActive
                      ? "border-foreground bg-foreground"
                      : "border-border/60",
                  )}
                />

                {/* Type icon */}
                <div className="w-5 h-5 rounded bg-muted/60 flex items-center justify-center shrink-0">
                  <LIcon className="w-2.5 h-2.5 text-muted-foreground" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 no-underline">
                  <p
                    className={cn(
                      "text-sm leading-snug truncate",
                      isActive
                        ? "font-medium text-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    {lesson.title}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {formatDuration(lesson.duration)}
                  </p>
                </div>
              </Link>
            </AccordionContent>
          );
        })}
      </AccordionItem>
    </Accordion>
  );
};

export default SidebarChapterAccordion;
