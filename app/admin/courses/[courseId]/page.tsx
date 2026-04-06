"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import {
  BookOpen,
  Plus,
  Edit,
  Trash2,
  Video,
  FileText,
  Code,
  CheckCircle,
  Clock,
  ChevronDown,
  ChevronRight,
  Save,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getCourseById } from "@/lib/actions/courses.action";
import {
  CourseWithLessons,
  CourseChapter,
  CourseLesson,
} from "@/types/action.d";

interface CourseDetailsState {
  course: CourseWithLessons | null;
  loading: boolean;
  error: string | null;
  editingChapter: string | null;
  editingLesson: string | null;
  expandedChapters: Set<string>;
}

export default function CourseDetails() {
  const params = useParams();
  const courseId = params.courseId as string;

  const [state, setState] = useState<CourseDetailsState>({
    course: null,
    loading: true,
    error: null,
    editingChapter: null,
    editingLesson: null,
    expandedChapters: new Set(),
  });

  const [newChapterTitle, setNewChapterTitle] = useState("");
  const [showNewChapterForm, setShowNewChapterForm] = useState(false);
  const [newLessonData, setNewLessonData] = useState<{
    title: string;
    description: string;
    lessonType: "text" | "video" | "project" | "quiz";
    duration: number;
    chapterId: string;
  }>({
    title: "",
    description: "",
    lessonType: "text",
    duration: 0,
    chapterId: "",
  });

  const loadCourse = useCallback(async () => {
    try {
      const result = await getCourseById(courseId);
      if (result.success && result.data) {
        const courseWithContent = result.data as CourseWithLessons;
        // Initialize with sample chapters and lessons for demo
        const courseWithDemoContent: CourseWithLessons = {
          ...courseWithContent,
          chapters: [
            {
              id: "ch-1",
              courseId: courseWithContent.id,
              title: "Getting Started",
              description: "Introduction to course",
              order: 1,
              isDeleted: false,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              id: "ch-2",
              courseId: courseWithContent.id,
              title: "Core Concepts",
              description: "Fundamental topics",
              order: 2,
              isDeleted: false,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
          lessons: [
            {
              id: "ls-1",
              courseId: courseWithContent.id,
              chapterId: "ch-1",
              title: "Course Introduction",
              description: "Welcome to course",
              duration: 300,
              lessonType: "video",
              order: 1,
              isPublished: true,
              isRequired: true,
              isDeleted: false,
              createdAt: new Date(),
              updatedAt: new Date(),
              chapter: { id: "ch-1", title: "Getting Started", order: 1 },
              resources: [],
            },
            {
              id: "ls-2",
              courseId: courseWithContent.id,
              chapterId: "ch-1",
              title: "Setup Instructions",
              description: "Setting up your environment",
              duration: 600,
              lessonType: "text",
              order: 2,
              isPublished: true,
              isRequired: true,
              isDeleted: false,
              createdAt: new Date(),
              updatedAt: new Date(),
              chapter: { id: "ch-1", title: "Getting Started", order: 1 },
              resources: [],
            },
          ],
        };

        const firstChapterId = courseWithDemoContent.chapters?.[0]?.id;
        setState((prev) => ({
          ...prev,
          course: courseWithDemoContent,
          loading: false,
          expandedChapters: firstChapterId
            ? new Set([firstChapterId])
            : new Set(),
        }));
      } else {
        setState((prev) => ({
          ...prev,
          error:
            typeof result.error === "string"
              ? result.error
              : result.error?.message || "Failed to load course",
          loading: false,
        }));
      }
    } catch {
      setState((prev) => ({
        ...prev,
        error: "An error occurred while loading the course",
        loading: false,
      }));
    }
  }, [courseId]);

  useEffect(() => {
    loadCourse();
  }, [loadCourse]);

  const toggleChapter = (chapterId: string) => {
    setState((prev) => {
      const newExpanded = new Set(prev.expandedChapters);
      if (newExpanded.has(chapterId)) {
        newExpanded.delete(chapterId);
      } else {
        newExpanded.add(chapterId);
      }
      return { ...prev, expandedChapters: newExpanded };
    });
  };

  const addChapter = () => {
    if (!newChapterTitle.trim() || !state.course) return;

    const newChapter: CourseChapter = {
      id: `ch-${Date.now()}`,
      courseId: state.course.id,
      title: newChapterTitle,
      description: "",
      order: (state.course.chapters?.length || 0) + 1,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setState((prev) => ({
      ...prev,
      course: prev.course
        ? {
            ...prev.course,
            chapters: [...(prev.course.chapters || []), newChapter],
          }
        : null,
    }));

    setNewChapterTitle("");
    setShowNewChapterForm(false);
  };

  const addLesson = (chapterId: string) => {
    if (!newLessonData.title.trim() || !state.course) return;

    const newLesson: CourseLesson = {
      id: `ls-${Date.now()}`,
      courseId: state.course.id,
      chapterId,
      title: newLessonData.title,
      description: newLessonData.description,
      duration: newLessonData.duration,
      lessonType: newLessonData.lessonType,
      order:
        (state.course.lessons?.filter((l) => l.chapterId === chapterId)
          .length || 0) + 1,
      isPublished: false,
      isRequired: true,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      chapter: state.course.chapters?.find((ch) => ch.id === chapterId),
      resources: [],
    };

    setState((prev) => ({
      ...prev,
      course: prev.course
        ? {
            ...prev.course,
            lessons: [...(prev.course.lessons || []), newLesson],
          }
        : null,
    }));

    setNewLessonData({
      title: "",
      description: "",
      lessonType: "text",
      duration: 0,
      chapterId: "",
    });
  };

  const deleteChapter = (chapterId: string) => {
    setState((prev) => ({
      ...prev,
      course: prev.course
        ? {
            ...prev.course,
            chapters:
              prev.course.chapters?.filter((ch) => ch.id !== chapterId) || [],
            lessons:
              prev.course.lessons?.filter((ls) => ls.chapterId !== chapterId) ||
              [],
          }
        : null,
    }));
  };

  const deleteLesson = (lessonId: string) => {
    setState((prev) => ({
      ...prev,
      course: prev.course
        ? {
            ...prev.course,
            lessons:
              prev.course.lessons?.filter((ls) => ls.id !== lessonId) || [],
          }
        : null,
    }));
  };

  if (state.loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading course...</div>
      </div>
    );
  }

  if (state.error || !state.course) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-destructive">
          {state.error || "Course not found"}
        </div>
      </div>
    );
  }

  const getLessonIcon = (type: string) => {
    switch (type) {
      case "video":
        return Video;
      case "project":
        return Code;
      case "quiz":
        return CheckCircle;
      default:
        return FileText;
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return hours > 0
      ? `${hours}h ${remainingMinutes}m`
      : `${remainingMinutes}m`;
  };

  const lessonsByChapter = new Map<string, CourseLesson[]>();
  state.course.chapters?.forEach((ch) => lessonsByChapter.set(ch.id, []));
  state.course.lessons?.forEach((lesson) => {
    if (lesson.chapterId) {
      const arr = lessonsByChapter.get(lesson.chapterId) ?? [];
      arr.push(lesson);
      lessonsByChapter.set(lesson.chapterId, arr);
    }
  });

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Course Header */}
      <div className="bg-background border border-border/50 rounded-xl p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">
              {state.course.title}
            </h1>
            <p className="text-muted-foreground">{state.course.description}</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                {state.course.chapters?.length || 0} chapters
              </span>
              <span className="flex items-center gap-1">
                <FileText className="w-4 h-4" />
                {state.course.lessons?.length || 0} lessons
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {formatDuration(
                  state.course.lessons?.reduce(
                    (acc, ls) => acc + ls.duration,
                    0,
                  ) || 0,
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
          <button
            onClick={() => setShowNewChapterForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            Add Chapter
          </button>
        </div>

        {/* New Chapter Form */}
        {showNewChapterForm && (
          <div className="bg-muted/30 border border-border/50 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Chapter title..."
                value={newChapterTitle}
                onChange={(e) => setNewChapterTitle(e.target.value)}
                className="flex-1 px-3 py-2 bg-background border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground/20"
                autoFocus
              />
              <button
                onClick={addChapter}
                className="p-2 bg-foreground text-background rounded-lg hover:opacity-90 transition-opacity"
              >
                <Save className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setShowNewChapterForm(false);
                  setNewChapterTitle("");
                }}
                className="p-2 border border-border/50 rounded-lg hover:bg-muted/40 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Chapters List */}
        <div className="space-y-3">
          {state.course.chapters?.map((chapter, index) => {
            const chapterLessons = lessonsByChapter.get(chapter.id) || [];
            const isExpanded = state.expandedChapters.has(chapter.id);
            const isAddingLesson = newLessonData.chapterId === chapter.id;

            return (
              <div
                key={chapter.id}
                className="bg-background border border-border/50 rounded-xl overflow-hidden"
              >
                {/* Chapter Header */}
                <div className="flex items-center gap-3 p-4">
                  <button
                    onClick={() => toggleChapter(chapter.id)}
                    className="p-1 hover:bg-muted/40 rounded transition-colors"
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>

                  <div className="w-8 h-8 rounded-full border border-border/60 flex items-center justify-center text-sm font-medium text-muted-foreground">
                    {index + 1}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">
                      {chapter.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {chapterLessons.length} lessons ·{" "}
                      {formatDuration(
                        chapterLessons.reduce(
                          (acc, ls) => acc + ls.duration,
                          0,
                        ),
                      )}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setState((prev) => ({
                          ...prev,
                          editingChapter: chapter.id,
                        }))
                      }
                      className="p-2 hover:bg-muted/40 rounded transition-colors"
                    >
                      <Edit className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button
                      onClick={() => deleteChapter(chapter.id)}
                      className="p-2 hover:bg-destructive/10 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </button>
                  </div>
                </div>

                {/* Lessons */}
                {isExpanded && (
                  <div className="border-t border-border/50">
                    {/* Add Lesson Form */}
                    <div className="p-4 border-b border-border/30 bg-muted/20">
                      {!isAddingLesson ? (
                        <button
                          onClick={() =>
                            setNewLessonData((prev) => ({
                              ...prev,
                              chapterId: chapter.id,
                            }))
                          }
                          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          Add Lesson
                        </button>
                      ) : (
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <input
                              type="text"
                              placeholder="Lesson title..."
                              value={newLessonData.title}
                              onChange={(e) =>
                                setNewLessonData((prev) => ({
                                  ...prev,
                                  title: e.target.value,
                                }))
                              }
                              className="px-3 py-2 bg-background border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground/20"
                            />
                            <select
                              value={newLessonData.lessonType}
                              onChange={(e) =>
                                setNewLessonData((prev) => ({
                                  ...prev,
                                  lessonType: e.target.value as
                                    | "text"
                                    | "video"
                                    | "project"
                                    | "quiz",
                                }))
                              }
                              className="px-3 py-2 bg-background border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground/20"
                            >
                              <option value="text">Text</option>
                              <option value="video">Video</option>
                              <option value="project">Project</option>
                              <option value="quiz">Quiz</option>
                            </select>
                          </div>
                          <div className="flex items-center gap-3">
                            <input
                              type="number"
                              placeholder="Duration (seconds)"
                              value={newLessonData.duration || ""}
                              onChange={(e) =>
                                setNewLessonData((prev) => ({
                                  ...prev,
                                  duration: parseInt(e.target.value) || 0,
                                }))
                              }
                              className="w-32 px-3 py-2 bg-background border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground/20"
                            />
                            <input
                              type="text"
                              placeholder="Description (optional)"
                              value={newLessonData.description}
                              onChange={(e) =>
                                setNewLessonData((prev) => ({
                                  ...prev,
                                  description: e.target.value,
                                }))
                              }
                              className="flex-1 px-3 py-2 bg-background border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground/20"
                            />
                            <button
                              onClick={() => addLesson(chapter.id)}
                              className="p-2 bg-foreground text-background rounded-lg hover:opacity-90 transition-opacity"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() =>
                                setNewLessonData({
                                  title: "",
                                  description: "",
                                  lessonType: "text",
                                  duration: 0,
                                  chapterId: "",
                                })
                              }
                              className="p-2 border border-border/50 rounded-lg hover:bg-muted/40 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Lessons List */}
                    {chapterLessons.map((lesson) => {
                      const LessonIcon = getLessonIcon(lesson.lessonType);
                      return (
                        <div
                          key={lesson.id}
                          className="flex items-center gap-3 p-4 border-b border-border/30 last:border-0 hover:bg-muted/20 transition-colors"
                        >
                          <div className="w-6 h-6 rounded-md bg-muted/60 flex items-center justify-center">
                            <LessonIcon className="w-3 h-3 text-muted-foreground" />
                          </div>

                          <div className="flex-1">
                            <h4 className="font-medium text-foreground text-sm">
                              {lesson.title}
                            </h4>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-xs text-muted-foreground capitalize">
                                {lesson.lessonType}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {formatDuration(lesson.duration)}
                              </span>
                              <span
                                className={cn(
                                  "text-xs px-2 py-0.5 rounded-full border",
                                  lesson.isPublished
                                    ? "border-green-500/30 text-green-600 bg-green-500/5"
                                    : "border-border/30 text-muted-foreground",
                                )}
                              >
                                {lesson.isPublished ? "Published" : "Draft"}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                setState((prev) => ({
                                  ...prev,
                                  editingLesson: lesson.id,
                                }))
                              }
                              className="p-1.5 hover:bg-muted/40 rounded transition-colors"
                            >
                              <Edit className="w-3.5 h-3.5 text-muted-foreground" />
                            </button>
                            <button
                              onClick={() => deleteLesson(lesson.id)}
                              className="p-1.5 hover:bg-destructive/10 rounded transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-destructive" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
