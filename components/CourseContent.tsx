"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import gsap from "gsap";

import {
  CourseLesson,
  CourseChapter,
  StudentLessonProgress,
} from "@/types/action.d";

import ChapterAccordion from "./cards/ChapterAccordion";

interface CourseContentProps {
  courseId: string;
  lessons?: CourseLesson[]; // Keep for backward compatibility
  chapters?: CourseChapter[]; // New structure: chapters with nested lessons
  studentProgress?: StudentLessonProgress[];
  isEnrolled?: boolean;
}

export default function CourseContent({
  courseId,
  lessons = [], // Keep for backward compatibility
  chapters = [],
  studentProgress = [],
  isEnrolled = false,
}: CourseContentProps) {
  const wrapRef = useRef<HTMLDivElement>(null);

  const totalLessons = chapters.reduce(
    (acc, chapter) => acc + (chapter.lessons?.length || 0),
    0,
  );

  const completedLessons = studentProgress.filter(
    (progress) => progress.status === "completed",
  ).length;

  const overallProgress = (completedLessons / totalLessons) * 100;

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
      {chapters.map((chapter) => {
        return (
          <ChapterAccordion
            key={chapter.id}
            courseId={courseId}
            isEnrolled={isEnrolled}
            chapter={chapter}
          />
        );
      })}
    </div>
  );
}
