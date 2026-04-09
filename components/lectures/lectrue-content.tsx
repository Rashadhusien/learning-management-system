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
import { cn, formatDuration } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";
import { CourseWithLessons, CourseLesson } from "@/types/action.d";
import ReactPlayer from "react-player";

gsap.registerPlugin(useGSAP);

type Tab = "overview" | "resources" | "discussion";

interface Props {
  course: CourseWithLessons;
  currentLesson: CourseLesson;
}

export default function LectrueContent({
  course,

  currentLesson,
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const mainRef = useRef<HTMLDivElement>(null);

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

  const TypeIcon =
    {
      video: Video,
      text: FileText,
      project: Code,
      quiz: CheckCircle,
      assignment: FileText,
    }[currentLesson.lessonType] ?? FileText;

  const allLessons = (course.chapters || []).flatMap((chapter) =>
    (chapter.lessons || []).sort((a, b) => a.order - b.order),
  );

  const lessonIndex = allLessons.findIndex((l) => l.id === currentLesson.id);
  const currentIndex = lessonIndex;
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  return (
    <div
      ref={mainRef}
      className="flex flex-col flex-1 h-full no-scrollbar min-w-0 overflow-y-auto mb-20"
    >
      {/* Video / content area */}
      <div className="bg-black aspect-video w-full shrink-0 flex items-center justify-center">
        {currentLesson.lessonType === "video" && currentLesson.videoUrl ? (
          <div className="w-full h-full">
            <ReactPlayer
              src={currentLesson.videoUrl}
              width="100%"
              height="100%"
              controls={true}
              playing={false}
              onError={(error) => {
                console.error("ReactPlayer error:", error);
              }}
            />
          </div>
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
            {lessonIndex + 1} / {allLessons.length}
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
  );
}
