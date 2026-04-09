import { cn, formatDuration } from "@/lib/utils";
import {
  CourseChapter,
  CourseLesson,
  StudentLessonProgress,
} from "@/types/action";
import {
  CheckCircle,
  Circle,
  Clock,
  Video,
  Edit3,
  Code,
  Download,
  FileText,
  Lock,
  Play,
} from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

const ChapterAccordion = ({
  courseId,
  isEnrolled,
  chapter,
}: {
  courseId: string;
  isEnrolled: boolean;
  chapter: CourseChapter;
}) => {
  const chapterLessons = chapter.lessons || [];
  const totalLessons = chapterLessons.length;

  const chProgress = 0;
  return (
    <Accordion
      key={chapter.id}
      type="single"
      collapsible
      className="ch-item bg-background border border-border/50 rounded-xl overflow-hidden"
    >
      {/* Chapter header */}
      <AccordionItem value={chapter.id}>
        <AccordionTrigger className="w-full flex items-center gap-3 px-4 py-3.5 hover:no-underline hover:bg-muted/40 transition-colors text-left">
          {/* Number */}
          <div className="w-6 h-6 rounded-full border border-border/60 flex items-center justify-center text-[11px] font-medium text-muted-foreground shrink-0">
            {chapter.order + 1}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground">
              {chapter.title}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {chapterLessons.length} lessons
              {chapterLessons.reduce((s, l) => s + (l.duration ?? 0), 0) > 0 &&
                ` · ${formatDuration(
                  chapterLessons.reduce((s, l) => s + (l.duration ?? 0), 0) ||
                    0,
                )}`}
            </p>
          </div>

          {/* Mini progress + chevron */}
          <div className="flex items-center gap-2.5 shrink-0">
            {isEnrolled && totalLessons > 0 && (
              <div className="w-12 h-1 bg-border/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-foreground/40 rounded-full transition-all duration-500"
                  style={{ width: `${chProgress}%` }}
                />
              </div>
            )}
          </div>
        </AccordionTrigger>

        {/* Lessons */}
        {totalLessons > 0 && (
          <AccordionContent className="border-t border-border/50">
            {chapterLessons.map((lesson, li) => (
              <LessonRow
                key={lesson.id}
                lesson={lesson}
                isEnrolled={isEnrolled}
                isLast={li === totalLessons - 1}
                courseId={courseId}
              />
            ))}
          </AccordionContent>
        )}
      </AccordionItem>
    </Accordion>
  );
};

export default ChapterAccordion;

function LessonRow({
  lesson,
  progress,
  isEnrolled,
  isLast,
  courseId,
}: {
  lesson: CourseLesson;
  progress?: StudentLessonProgress;
  isEnrolled: boolean;
  isLast: boolean;
  courseId: string;
}) {
  const isCompleted = progress?.status === "completed";
  const isInProgress = progress?.status === "in_progress";

  const TypeIcon =
    {
      video: Video,
      text: FileText,
      project: Code,
      quiz: CheckCircle,
      assignment: Edit3,
    }[lesson.lessonType] ?? FileText;

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-2.5 hover:bg-muted/30 transition-colors",
        !isLast && "border-b border-border/40",
      )}
    >
      {/* Status dot */}
      <div className="shrink-0">
        {!isEnrolled ? (
          <Lock className="w-3.5 h-3.5 text-border" />
        ) : isCompleted ? (
          <CheckCircle className="w-3.5 h-3.5 text-green-600" />
        ) : isInProgress ? (
          <Circle className="w-3.5 h-3.5 text-blue-500" />
        ) : (
          <Circle className="w-3.5 h-3.5 text-border" />
        )}
      </div>

      {/* Type icon */}
      <div className="w-6 h-6 rounded-md bg-muted/60 flex items-center justify-center shrink-0">
        <TypeIcon className="w-3 h-3 text-muted-foreground" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-foreground truncate">
          {lesson.title}
        </p>
        <div className="flex items-center gap-3 mt-0.5">
          {lesson.duration && (
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Clock className="w-2.5 h-2.5" />
              {formatDuration(lesson.duration)}
            </span>
          )}
          {lesson.resources && lesson.resources.length > 0 && (
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Download className="w-2.5 h-2.5" />
              {lesson.resources.length}
            </span>
          )}
        </div>
      </div>

      {/* Required/Optional pill */}
      <span
        className={cn(
          "text-[10px] px-2 py-0.5 rounded-full border shrink-0",
          lesson.isRequired
            ? "border-border/50 text-muted-foreground"
            : "border-border/30 text-muted-foreground/60",
        )}
      >
        {lesson.isRequired ? "Required" : "Optional"}
      </span>

      {/* Action */}
      {isEnrolled ? (
        <Button variant={"outline"} size={"icon-xs"} asChild>
          <Link href={ROUTES.LESSON(courseId, lesson.id)}>
            <Play className="w-2 h-2 fill-muted-foreground text-muted-foreground ml-px" />
          </Link>
        </Button>
      ) : (
        <div className="w-6 h-6 flex items-center justify-center shrink-0">
          <Lock className="w-3 h-3 text-border" />
        </div>
      )}
    </div>
  );
}
