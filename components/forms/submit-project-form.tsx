"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import type { Resolver } from "react-hook-form";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup } from "@/components/ui/input-group";
import { SubmitProjectSchema } from "@/lib/validations";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Course, Project } from "@/types/action";
import { getAllCourses } from "@/lib/actions/courses.action";
import { getProjectsByCourse } from "@/lib/actions/projects.action";
import { DialogClose } from "../ui/dialog";
import { submitProject } from "@/lib/actions/project-submissions.action";
import {
  BookOpen,
  FolderOpen,
  Github,
  Globe,
  Loader2,
  X,
  Upload,
} from "lucide-react";

type SubmitProjectFormData = z.infer<typeof SubmitProjectSchema>;

const SubmitProjectForm = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");

  const form = useForm<SubmitProjectFormData>({
    resolver: zodResolver(
      SubmitProjectSchema,
    ) as Resolver<SubmitProjectFormData>,
    defaultValues: { courseId: "", projectId: "", repoLink: "", demoLink: "" },
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const result = await getAllCourses({ page: 1, pageSize: 100 });
        if (result.success && result.data) setCourses(result.data);
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    if (!selectedCourseId) return;
    const fetchProjects = async () => {
      try {
        const result = await getProjectsByCourse(selectedCourseId);
        setProjects(result.success && result.data ? result.data : []);
      } catch {
        setProjects([]);
      }
    };
    fetchProjects();
  }, [selectedCourseId]);

  const handleSubmit = async (data: SubmitProjectFormData) => {
    try {
      const result = await submitProject(data);
      if (result.success) {
        toast.success("Project submitted!", {
          description: "Your submission has been recorded successfully.",
        });
        form.reset();
        setSelectedCourseId("");
      } else {
        toast.error("Submission failed", {
          description: result.error || "Please try again.",
        });
      }
    } catch {
      toast.error("Submission failed", {
        description: "An unexpected error occurred. Please try again.",
      });
    }
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <form
      id="submit-project-form"
      onSubmit={form.handleSubmit(handleSubmit)}
      className="space-y-5"
    >
      {/* ── Course ────────────────────────────────────────────── */}
      <Controller
        name="courseId"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel
              htmlFor="field-course"
              className="body-medium text-foreground flex items-center gap-1.5 mb-1.5"
            >
              <BookOpen className="w-3.5 h-3.5 text-primary" />
              Course
              <span className="text-primary ml-0.5">*</span>
            </FieldLabel>
            <Select
              value={field.value}
              onValueChange={(val) => {
                field.onChange(val);
                setSelectedCourseId(val);
                form.setValue("projectId", "");
              }}
              disabled={courses.length === 0}
            >
              <SelectTrigger
                id="field-course"
                className="w-full h-10 rounded-xl border-border bg-background text-sm
                           focus:ring-1 focus:ring-primary/30 focus:border-primary/60
                           data-[invalid=true]:border-destructive transition-all no-focus"
              >
                <SelectValue placeholder="Select a course…" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {courses.map((c) => (
                  <SelectItem key={c.id} value={c.id} className="text-sm">
                    {c.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* ── Project (conditional) ─────────────────────────────── */}
      {selectedCourseId && (
        <Controller
          name="projectId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="field-project"
                className="body-medium text-foreground flex items-center gap-1.5 mb-1.5"
              >
                <FolderOpen className="w-3.5 h-3.5 text-primary" />
                Project
                <span className="text-primary ml-0.5">*</span>
              </FieldLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={projects.length === 0}
              >
                <SelectTrigger
                  id="field-project"
                  className="w-full h-10 rounded-xl border-border bg-background text-sm
                             focus:ring-1 focus:ring-primary/30 focus:border-primary/60
                             data-[invalid=true]:border-destructive transition-all no-focus"
                >
                  <SelectValue
                    placeholder={
                      projects.length === 0
                        ? "No projects available"
                        : "Select a project…"
                    }
                  />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={p.id} className="text-sm">
                      {p.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      )}

      {/* ── Links row ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Repo link */}
        <Controller
          name="repoLink"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="field-repo"
                className="body-medium text-foreground flex items-center gap-1.5 mb-1.5"
              >
                <Github className="w-3.5 h-3.5 text-primary" />
                GitHub Link
                <span className="small-regular text-muted-foreground ml-1">
                  (optional)
                </span>
              </FieldLabel>
              <InputGroup>
                <Input
                  {...field}
                  id="field-repo"
                  placeholder="https://github.com/…"
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

        {/* Demo link */}
        <Controller
          name="demoLink"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="field-demo"
                className="body-medium text-foreground flex items-center gap-1.5 mb-1.5"
              >
                <Globe className="w-3.5 h-3.5 text-primary" />
                Live Preview
                <span className="text-primary ml-0.5">*</span>
              </FieldLabel>
              <InputGroup>
                <Input
                  {...field}
                  id="field-demo"
                  placeholder="https://your-demo.com"
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

      {/* ── Divider ───────────────────────────────────────────── */}
      <div className="h-px bg-border" />

      {/* ── Footer actions ────────────────────────────────────── */}
      <div className="flex items-center justify-end gap-3 pt-1">
        <DialogClose asChild>
          <Button
            type="button"
            variant="ghost"
            className="gap-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary"
          >
            <X className="w-4 h-4" />
            Cancel
          </Button>
        </DialogClose>

        <Button
          type="submit"
          form="submit-project-form"
          disabled={isSubmitting}
          className="gap-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground
                     font-semibold px-6 shadow-sm transition-all active:scale-[0.98]
                     disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Submitting…
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              Submit Project
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default SubmitProjectForm;
