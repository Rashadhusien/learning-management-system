"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";

import type { Resolver } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup } from "@/components/ui/input-group";
import { CreateLessonInput, createLessonSchema } from "@/lib/validations";

import { BookOpen, Globe, Loader2, ListOrdered } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { createLesson } from "@/lib/actions/lectures.action";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LESSONTYPES } from "@/constants";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const CreateLessonForm = ({
  courseId,
  chapterId,
  setShowLessonForm,
}: {
  courseId: string;
  chapterId: string;
  setShowLessonForm: (show: boolean) => void;
}) => {
  const form = useForm<CreateLessonInput>({
    resolver: zodResolver(createLessonSchema) as Resolver<CreateLessonInput>,
    defaultValues: {
      courseId: courseId || "",
      chapterId: chapterId || "",
      title: "",
      order: 0,
      description: "",
      lessonType: "text",
      duration: 0,
      isPublished: false,
      isRequired: true,
      content: "",
      videoUrl: "",
      projectInstructions: "",
      starterCode: "",
      solutionCode: "",
    },
  });

  // Validate props after hook initialization
  if (!courseId || !chapterId) {
    console.error("CreateLessonForm: Missing required props", {
      courseId,
      chapterId,
    });
    return (
      <div className="text-red-500">
        Error: Missing course or chapter information
      </div>
    );
  }

  const handleSubmit = async (data: CreateLessonInput) => {
    console.log("Form data being submitted:", {
      courseId: data.courseId,
      chapterId: data.chapterId,
      title: data.title,
      lessonType: data.lessonType,
      duration: data.duration,
      description: data.description,
      videoUrl: data.videoUrl,
      content: data.content,
      order: data.order,
      isPublished: data.isPublished,
      isRequired: data.isRequired,
    });

    try {
      const result = await createLesson(data);
      if (result.success) {
        toast.success("Lesson created successfully");

        form.reset();
        setShowLessonForm(false);
      } else {
        toast.error(result.error || "Failed to create lesson");
      }
    } catch (error) {
      console.error("Submit error:", error);
      console.log("Form errors:", form.formState.errors);
      console.log("Form values:", form.getValues());
      toast.error("An unexpected error occurred");
    }
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <form
      id="create-lesson-form"
      onSubmit={form.handleSubmit(handleSubmit)}
      className="space-y-5"
    >
      <Controller
        name="title"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel
              htmlFor="create-lesson-title"
              className="body-medium text-foreground flex items-center gap-1.5 mb-1.5"
            >
              <BookOpen className="w-3.5 h-3.5 text-primary" />
              Lesson Title
            </FieldLabel>
            <InputGroup>
              <Input
                {...field}
                id="create-lesson-title"
                placeholder="Lesson Title"
                aria-invalid={fieldState.invalid}
                className="h-10 rounded-xl border-border bg-background text-sm
                              placeholder:text-muted-foreground/50 no-focus
                              focus-visible:ring-1 focus-visible:ring-primary/30
                              focus-visible:border-primary/60 transition-all"
              />
            </InputGroup>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Controller
          name="lessonType"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="create-lesson-type"
                className="body-medium text-foreground flex items-center gap-1.5 mb-1.5"
              >
                <BookOpen className="w-3.5 h-3.5 text-primary" />
                Lesson Type
              </FieldLabel>
              <Select
                value={field.value}
                onValueChange={(value) => field.onChange(value)}
              >
                <SelectTrigger id="create-lesson-type">
                  <SelectValue placeholder="Select lesson type" />
                </SelectTrigger>
                <SelectContent>
                  {LESSONTYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="duration"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="create-lesson-duration"
                className="body-medium text-foreground flex items-center gap-1.5 mb-1.5"
              >
                <ListOrdered className="w-3.5 h-3.5 text-primary" />
                Duration (seconds)
              </FieldLabel>
              <InputGroup>
                <Input
                  value={field.value || 0}
                  onChange={(e) =>
                    field.onChange(parseInt(e.target.value) || 0)
                  }
                  id="create-lesson-duration"
                  type="number"
                  placeholder="Duration in seconds"
                  aria-invalid={fieldState.invalid}
                  className="h-10 rounded-xl border-border bg-background text-sm
                              placeholder:text-muted-foreground/50 no-focus
                              focus-visible:ring-1 focus-visible:ring-primary/30
                              focus-visible:border-primary/60 transition-all"
                />
              </InputGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>

      <Controller
        name="description"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel
              htmlFor="create-lesson-description"
              className="body-medium text-foreground flex items-center gap-1.5 mb-1.5"
            >
              Description
              <span className="small-regular text-muted-foreground ml-1">
                (optional)
              </span>
            </FieldLabel>
            <InputGroup>
              <Textarea
                {...field}
                id="create-lesson-description"
                placeholder="Brief description about the lesson"
                aria-invalid={fieldState.invalid}
                className="h-20 rounded-xl border-border bg-background no-scrollbar text-sm
                              placeholder:text-muted-foreground/50 no-focus
                              focus-visible:ring-1 focus-visible:ring-primary/30
                              focus-visible:border-primary/60 transition-all"
              />
            </InputGroup>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="videoUrl"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel
              htmlFor="create-lesson-videoUrl"
              className="body-medium text-foreground flex items-center gap-1.5 mb-1.5"
            >
              <Globe className="w-3.5 h-3.5 text-primary" />
              Video URL
              <span className="small-regular text-muted-foreground ml-1">
                (for video lessons)
              </span>
            </FieldLabel>
            <InputGroup>
              <Input
                value={field.value || ""}
                onChange={(e) => field.onChange(e.target.value || undefined)}
                id="create-lesson-videoUrl"
                type="url"
                placeholder="https://example.com/video.mp4"
                aria-invalid={fieldState.invalid}
                className="h-10 rounded-xl border-border bg-background text-sm
                              placeholder:text-muted-foreground/50 no-focus
                              focus-visible:ring-1 focus-visible:ring-primary/30
                              focus-visible:border-primary/60 transition-all"
              />
            </InputGroup>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="content"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel
              htmlFor="create-lesson-content"
              className="body-medium text-foreground flex items-center gap-1.5 mb-1.5"
            >
              <BookOpen className="w-3.5 h-3.5 text-primary" />
              Content
              <span className="small-regular text-muted-foreground ml-1">
                (for text lessons)
              </span>
            </FieldLabel>
            <InputGroup>
              <Textarea
                value={field.value || ""}
                onChange={(e) => field.onChange(e.target.value || undefined)}
                id="create-lesson-content"
                placeholder="Lesson content in markdown or plain text"
                aria-invalid={fieldState.invalid}
                className="h-32 rounded-xl border-border bg-background no-scrollbar text-sm
                              placeholder:text-muted-foreground/50 no-focus
                              focus-visible:ring-1 focus-visible:ring-primary/30
                              focus-visible:border-primary/60 transition-all"
              />
            </InputGroup>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Controller
          name="order"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="create-lesson-order"
                className="body-medium text-foreground flex items-center gap-1.5 mb-1.5"
              >
                <ListOrdered className="w-3.5 h-3.5 text-primary" />
                Order
                <span className="small-regular text-muted-foreground ml-1">
                  (optional)
                </span>
              </FieldLabel>
              <InputGroup>
                <Input
                  value={field.value || ""}
                  onChange={(e) =>
                    field.onChange(parseInt(e.target.value) || undefined)
                  }
                  id="create-lesson-order"
                  type="number"
                  placeholder="Lesson Order"
                  aria-invalid={fieldState.invalid}
                  className="h-10 rounded-xl border-border bg-background text-sm
                              placeholder:text-muted-foreground/50 no-focus
                              focus-visible:ring-1 focus-visible:ring-primary/30
                              focus-visible:border-primary/60 transition-all"
                />
              </InputGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="flex items-center gap-4 pt-6">
          <Controller
            name="isPublished"
            control={form.control}
            render={({ field }) => (
              <div className="flex gap-2">
                <Checkbox
                  id="isPublished"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <Label htmlFor="isPublished">Published</Label>
              </div>
            )}
          />

          <Controller
            name="isRequired"
            control={form.control}
            render={({ field }) => (
              <div className="flex gap-2">
                <Checkbox
                  id="isRequired"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <Label htmlFor="isRequired">Required</Label>
              </div>
            )}
          />
        </div>
      </div>

      {/* ── Divider ───────────────────────────────────────────── */}
      <Separator />

      {/* ── Footer actions ────────────────────────────────────── */}
      <div className="flex items-center justify-end gap-3 pt-1">
        <Button
          onClick={() => setShowLessonForm(false)}
          type="button"
          variant="ghost"
          className="gap-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary"
        >
          Cancel
        </Button>

        <Button
          type="submit"
          form="create-lesson-form"
          disabled={isSubmitting}
          className="gap-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground
                      font-semibold px-6 shadow-sm transition-all active:scale-[0.98]
                      disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              creating...
            </>
          ) : (
            <>Create Lesson</>
          )}
        </Button>
      </div>
    </form>
  );
};

export default CreateLessonForm;
