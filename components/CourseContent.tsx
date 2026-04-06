"use client";

import { useState } from "react";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import gsap from "gsap";
import {
  Play,
  Clock,
  FileText,
  Video,
  Code,
  CheckCircle,
  Circle,
  Lock,
  Download,
  ChevronDown,
  Edit3,
} from "lucide-react";
import {
  CourseLesson,
  CourseChapter,
  StudentLessonProgress,
} from "@/types/action.d";
import { cn } from "@/lib/utils";

interface CourseContentProps {
  courseId: string;
  lessons: CourseLesson[];
  chapters?: CourseChapter[];
  studentProgress?: StudentLessonProgress[];
  isEnrolled?: boolean;
}

export default function CourseContent({
  lessons,
  chapters = [],
  studentProgress = [],
  isEnrolled = false,
}: CourseContentProps) {
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(
    () => new Set(chapters[0] ? [chapters[0].id] : []), // first chapter open by default
  );
  const wrapRef = useRef<HTMLDivElement>(null);

  // Group lessons by chapter
  const lessonsByChapter = new Map<string, CourseLesson[]>();
  chapters.forEach((ch) => lessonsByChapter.set(ch.id, []));
  lessons.forEach((lesson) => {
    if (lesson.chapter) {
      const arr = lessonsByChapter.get(lesson.chapter.id) ?? [];
      arr.push(lesson);
      lessonsByChapter.set(lesson.chapter.id, arr);
    }
  });

  const totalLessons = lessons.length;
  const completedLessons = studentProgress.filter(
    (p) => p.status === "completed",
  ).length;
  const overallProgress =
    totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  const getLessonProgress = (id: string) =>
    studentProgress.find((p) => p.lessonId === id);

  const toggle = (chapterId: string) => {
    setExpandedChapters((prev) => {
      const next = new Set(prev);
      if (next.has(chapterId)) {
        next.delete(chapterId);
      } else {
        next.add(chapterId);
      }
      return next;
    });
  };

  // Entrance animation
  useGSAP(
    () => {
      if (!wrapRef.current) return;
      gsap.from(".ch-item", {
        opacity: 0,
        y: 16,
        duration: 0.45,
        stagger: 0.08,
        ease: "power3.out",
        clearProps: "all",
      });
    },
    { scope: wrapRef },
  );

  return (
    <div ref={wrapRef} className="space-y-3">
      {/* Progress bar */}
      {isEnrolled && (
        <div className="ch-item bg-muted/30 border border-border/50 rounded-xl px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">
              Your progress
            </span>
            <span className="text-xs text-muted-foreground">
              {completedLessons} / {totalLessons} lessons
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-1 bg-border/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-foreground/40 rounded-full transition-all duration-500"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
            <span className="text-xs font-medium text-foreground w-8 text-right">
              {Math.round(overallProgress)}%
            </span>
          </div>
        </div>
      )}

      {/* Section header */}
      <div className="ch-item flex items-center justify-between px-1">
        <span className="text-sm font-medium text-foreground">
          Course content
        </span>
        <span className="text-xs text-muted-foreground">
          {chapters.length} chapters · {totalLessons} lessons
        </span>
      </div>

      {/* Chapters */}
      {chapters.map((chapter, ci) => {
        const chLessons = (lessonsByChapter.get(chapter.id) ?? []).sort(
          (a, b) => a.order - b.order,
        );
        const isOpen = expandedChapters.has(chapter.id);
        const chCompleted = chLessons.filter(
          (l) => getLessonProgress(l.id)?.status === "completed",
        ).length;
        const chProgress =
          chLessons.length > 0 ? (chCompleted / chLessons.length) * 100 : 0;

        return (
          <div
            key={chapter.id}
            className="ch-item bg-background border border-border/50 rounded-xl overflow-hidden"
          >
            {/* Chapter header */}
            <button
              onClick={() => toggle(chapter.id)}
              className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-muted/40 transition-colors text-left"
            >
              {/* Number */}
              <div className="w-6 h-6 rounded-full border border-border/60 flex items-center justify-center text-[11px] font-medium text-muted-foreground shrink-0">
                {ci + 1}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {chapter.title}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {chLessons.length} lessons
                  {chLessons.reduce((s, l) => s + (l.duration ?? 0), 0) > 0 &&
                    ` · ${formatDuration(chLessons.reduce((s, l) => s + (l.duration ?? 0), 0))}`}
                </p>
              </div>

              {/* Mini progress + chevron */}
              <div className="flex items-center gap-2.5 shrink-0">
                {isEnrolled && chLessons.length > 0 && (
                  <div className="w-12 h-1 bg-border/50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-foreground/40 rounded-full transition-all duration-500"
                      style={{ width: `${chProgress}%` }}
                    />
                  </div>
                )}
                <ChevronDown
                  className={cn(
                    "w-3.5 h-3.5 text-muted-foreground transition-transform duration-250",
                    isOpen && "rotate-180",
                  )}
                />
              </div>
            </button>

            {/* Lessons */}
            {isOpen && chLessons.length > 0 && (
              <div className="border-t border-border/50">
                {chLessons.map((lesson, li) => (
                  <LessonRow
                    key={lesson.id}
                    lesson={lesson}
                    progress={getLessonProgress(lesson.id)}
                    isEnrolled={isEnrolled}
                    isLast={li === chLessons.length - 1}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function LessonRow({
  lesson,
  progress,
  isEnrolled,
  isLast,
}: {
  lesson: CourseLesson;
  progress?: StudentLessonProgress;
  isEnrolled: boolean;
  isLast: boolean;
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
        <button className="w-6 h-6 rounded-full border border-border/50 flex items-center justify-center shrink-0 hover:bg-muted/60 hover:border-border/80 transition-all">
          <Play className="w-2.5 h-2.5 fill-muted-foreground text-muted-foreground ml-px" />
        </button>
      ) : (
        <div className="w-6 h-6 flex items-center justify-center shrink-0">
          <Lock className="w-3 h-3 text-border" />
        </div>
      )}
    </div>
  );
}

function formatDuration(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}
