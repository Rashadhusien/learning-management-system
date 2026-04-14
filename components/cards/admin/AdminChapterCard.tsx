"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn, formatDuration, getLessonIcon } from "@/lib/utils";
import { CourseChapter } from "@/types/action";
import { Button } from "@base-ui/react";
import { Edit, Plus, Trash2 } from "lucide-react";
import React, { useState } from "react";
import CreateLessonForm from "@/components/forms/admin/CreateLessonForm";

const AdminChapterCard = ({
  chapter,
  chapterIndex,
}: {
  chapter: CourseChapter;
  chapterIndex: number;
}) => {
  const [showLessonForm, setShowLessonForm] = useState(false);

  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={chapter.id.toString()}
      className=" bg-background border border-border/50 rounded-xl   "
    >
      <AccordionItem value={chapter.id.toString()}>
        <AccordionTrigger className="flex justify-center items-center hover:no-underline hover:bg-muted/20">
          <div className="flex flex-1 items-center gap-3 p-4">
            <div className="w-8 h-8 rounded-full border border-border/60 flex items-center justify-center text-sm font-medium text-muted-foreground">
              {chapterIndex + 1}
            </div>

            <div className="flex-1">
              <h3 className="font-medium text-foreground">{chapter.title}</h3>
              <p className="text-sm text-muted-foreground">
                {chapter.lessons?.length} lessons ·
                {formatDuration(
                  chapter.lessons?.reduce(
                    (acc, ls) => acc + (ls.duration || 0),
                    0,
                  ) || 0,
                )}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div
                className="p-2 hover:bg-muted/40 rounded transition-colors cursor-pointer"
                onClick={(e) => e.stopPropagation()}
              >
                <Edit className="w-4 h-4 text-muted-foreground" />
              </div>
              <div
                className="p-2 hover:bg-destructive/10 rounded transition-colors cursor-pointer"
                onClick={(e) => e.stopPropagation()}
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </div>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="overflow-hidden rounded-lg h-fit p-0">
          <div>
            <div className="p-4 ">
              {!showLessonForm ? (
                <Button
                  onClick={() => setShowLessonForm(true)}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full"
                >
                  <Plus className="w-4 h-4" />
                  Add Lesson
                </Button>
              ) : (
                <CreateLessonForm
                  courseId={chapter.courseId}
                  chapterId={chapter.id}
                  setShowLessonForm={setShowLessonForm}
                />
              )}
            </div>
          </div>
        </AccordionContent>
        <AccordionContent className="overflow-hidden rounded-lg">
          <div>
            {chapter.lessons?.map((lesson) => {
              const LessonIcon = getLessonIcon(lesson.lessonType);
              return (
                <div
                  key={lesson.id}
                  className="flex items-center gap-3 rounded-2xl p-4 border-b border-border/30 last:border-0 hover:bg-muted/20 transition-colors"
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
                    <div
                      className="p-1.5 hover:bg-muted/40 rounded transition-colors cursor-pointer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Edit className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                    <div
                      className="p-1.5 hover:bg-destructive/10 rounded transition-colors cursor-pointer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Trash2 className="w-3.5 h-3.5 text-destructive" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default AdminChapterCard;
