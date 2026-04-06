// components/lesson/LessonPlayer.tsx
"use client";

import { useState, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  FileText,
  Code,
  CheckCircle,
  Clock,
  Link2,
  Download,
  Video,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";
import { CourseWithLessons, CourseLesson } from "@/types/action.d";

gsap.registerPlugin(useGSAP);

type Tab = "overview" | "resources" | "discussion";

interface Props {
  course: CourseWithLessons;
  currentLesson: CourseLesson;
  prevLesson: CourseLesson | null;
  nextLesson: CourseLesson | null;
}

export default function LecturePlayer({
  course,
  currentLesson,
  prevLesson,
  nextLesson,
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(
    () => new Set(currentLesson.chapter ? [currentLesson.chapter.id] : []),
  );
  const mainRef = useRef<HTMLDivElement>(null);

  // Sort lessons by order
  const sortedLessons = [...(course.lessons || [])].sort(
    (a, b) => a.order - b.order,
  );
  const totalLessons = sortedLessons.length;

  // Group by chapter preserving chapter order
  const sortedChapters = [...(course.chapters ?? [])].sort(
    (a, b) => a.order - b.order,
  );
  const lessonsByChapter = new Map<string, CourseLesson[]>();
  sortedChapters.forEach((ch) => lessonsByChapter.set(ch.id, []));
  sortedLessons.forEach((l) => {
    if (l.chapter) {
      const arr = lessonsByChapter.get(l.chapter.id) ?? [];
      arr.push(l);
      lessonsByChapter.set(l.chapter.id, arr);
    }
  });

  const toggleChapter = (id: string) => {
    setExpandedChapters((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Animate main panel when lesson changes
  useGSAP(
    () => {
      if (!mainRef.current) return;
      gsap.from(mainRef.current, {
        opacity: 0,
        y: 8,
        duration: 0.35,
        ease: "power2.out",
        clearProps: "all",
      });
    },
    { scope: mainRef, dependencies: [currentLesson.id] },
  );

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return s > 0 ? `${m}:${String(s).padStart(2, "0")}` : `${m}m`;
  };

  const TypeIcon =
    {
      video: Video,
      text: FileText,
      project: Code,
      quiz: CheckCircle,
      assignment: FileText,
    }[currentLesson.lessonType] ?? FileText;

  const lessonIndex = sortedLessons.findIndex((l) => l.id === currentLesson.id);

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-background">
      {/* ── Sidebar ─────────────────────────────────────────────────── */}
      <aside className="w-80 shrink-0 border-l border-border/50 flex flex-col overflow-hidden">
        {/* Sticky header */}
        <div className="px-4 py-3 border-b border-border/50 flex items-center justify-between shrink-0 bg-background">
          <span className="text-sm font-medium text-foreground">
            Course content
          </span>
          <div className="flex items-center gap-2">
            <div className="w-12 h-1 bg-border/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-foreground/40 rounded-full transition-all duration-500"
                style={{
                  width: `${((lessonIndex + 1) / totalLessons) * 100}%`,
                }}
              />
            </div>
            <span className="text-[11px] text-muted-foreground">
              {lessonIndex + 1}/{totalLessons}
            </span>
          </div>
        </div>

        {/* Chapters + lessons */}
        <div className="overflow-y-auto flex-1">
          {sortedChapters.map((chapter, ci) => {
            const chLessons = lessonsByChapter.get(chapter.id) ?? [];
            const isOpen = expandedChapters.has(chapter.id);
            const totalMins = Math.round(
              chLessons.reduce((s, l) => s + l.duration, 0) / 60,
            );

            return (
              <div key={chapter.id} className="border-b border-border/40">
                {/* Chapter header */}
                <button
                  onClick={() => toggleChapter(chapter.id)}
                  className="w-full flex items-center gap-2.5 px-4 py-3 hover:bg-muted/30 transition-colors text-left"
                >
                  <div className="w-5 h-5 rounded-full border border-border/60 flex items-center justify-center text-[10px] font-medium text-muted-foreground shrink-0">
                    {ci + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground">
                      {chapter.title}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {chLessons.length} lessons · {totalMins}m
                    </p>
                  </div>
                  <ChevronDown
                    className={cn(
                      "w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 shrink-0",
                      isOpen && "rotate-180",
                    )}
                  />
                </button>

                {/* Lessons list */}
                {isOpen && (
                  <div className="border-t border-border/30">
                    {chLessons.map((lesson) => {
                      const isActive = lesson.id === currentLesson.id;
                      const LIcon =
                        {
                          video: Video,
                          text: FileText,
                          project: Code,
                          quiz: CheckCircle,
                          assignment: FileText,
                        }[lesson.lessonType] ?? FileText;

                      return (
                        <Link
                          key={lesson.id}
                          href={ROUTES.LESSON(course.id, lesson.id)}
                          className={cn(
                            "flex items-center gap-2.5 pl-10 pr-4 py-2.5 border-b border-border/30 last:border-0 transition-colors",
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
                          <div className="flex-1 min-w-0">
                            <p
                              className={cn(
                                "text-[11.5px] leading-snug truncate",
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
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </aside>
      {/* ── Main content ───────────────────────────────────────────── */}
      <div
        ref={mainRef}
        className="flex flex-col flex-1 h-full no-scrollbar min-w-0 overflow-y-auto mb-20"
      >
        {/* Video / content area */}
        <div className="bg-black aspect-video w-full shrink-0 flex items-center justify-center">
          {currentLesson.lessonType === "video" && currentLesson.videoUrl ? (
            <video
              src={currentLesson.videoUrl}
              controls
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="flex flex-col items-center gap-3 text-white/60">
              <TypeIcon className="w-10 h-10 opacity-40" strokeWidth={1.2} />
              <span className="text-sm">{currentLesson.title}</span>
            </div>
          )}
        </div>

        {/* Prev / Next nav */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border/50 bg-background shrink-0">
          {prevLesson ? (
            <Link
              href={ROUTES.LESSON(course.id, prevLesson.id)}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground border border-border/50 px-3 py-1.5 rounded-lg hover:bg-muted/40 hover:text-foreground transition-all"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Previous
            </Link>
          ) : (
            <div />
          )}

          {nextLesson ? (
            <Link
              href={ROUTES.LESSON(course.id, nextLesson.id)}
              className="inline-flex items-center gap-1.5 text-xs font-medium bg-foreground text-background px-4 py-1.5 rounded-lg hover:opacity-85 transition-opacity"
            >
              Complete & Continue
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-foreground text-background px-4 py-1.5 rounded-lg opacity-60">
              Course Complete
            </span>
          )}
        </div>

        {/* Lesson info */}
        <div className="px-5 py-4 border-b border-border/50 shrink-0">
          <h1 className="text-base font-medium text-foreground mb-1.5">
            {currentLesson.title}
          </h1>
          <div className="flex items-center gap-4 flex-wrap">
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <TypeIcon className="w-3 h-3" />
              {currentLesson.lessonType}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              {formatDuration(currentLesson.duration)}
            </span>
            {currentLesson.chapter && (
              <span className="text-xs text-muted-foreground">
                {currentLesson.chapter.title}
              </span>
            )}
            <span className="text-xs text-muted-foreground ml-auto">
              {lessonIndex + 1} / {totalLessons}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex px-5 border-b border-border/50 shrink-0">
          {(["overview", "resources", "discussion"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "text-xs py-2.5 mr-5 border-b-[1.5px] transition-colors capitalize",
                activeTab === tab
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="px-5 py-4 flex-1">
          {activeTab === "overview" && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {currentLesson.description ?? "No description provided."}
            </p>
          )}

          {activeTab === "resources" && (
            <div className="space-y-2">
              {!currentLesson.resources?.length && (
                <p className="text-sm text-muted-foreground">
                  No resources for this lesson.
                </p>
              )}
              {currentLesson.resources?.map((res) => (
                <a
                  key={res.id}
                  href={res.url ?? res.fileUrl ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 border border-border/50 rounded-xl hover:bg-muted/40 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center shrink-0">
                    {res.resourceType === "link" ? (
                      <Link2 className="w-3.5 h-3.5 text-muted-foreground" />
                    ) : (
                      <Download className="w-3.5 h-3.5 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {res.title}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {res.resourceType}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          )}

          {activeTab === "discussion" && (
            <p className="text-sm text-muted-foreground">No comments yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
