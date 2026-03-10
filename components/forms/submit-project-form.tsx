"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import type { Resolver } from "react-hook-form";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
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
// import { submitProject } from "@/lib/actions/projects.action";

type SubmitProjectFormData = z.infer<typeof SubmitProjectSchema>;

const SubmitProjectForm = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  const [courses, setCourses] = useState<Course[]>([]);

  const [selectedCourseId, setSelectedCourseId] = useState("");

  const form = useForm<SubmitProjectFormData>({
    resolver: zodResolver(
      SubmitProjectSchema,
    ) as Resolver<SubmitProjectFormData>,
    defaultValues: {
      courseId: "",
      projectId: "",
      repoLink: "",
      demoLink: "",
    },
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const result = await getAllCourses({ page: 1, pageSize: 100 });
        if (result.success && result.data) {
          setCourses(result.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    if (!selectedCourseId) {
      return;
    }

    const fetchCourseProjects = async () => {
      try {
        const result = await getProjectsByCourse(selectedCourseId);
        if (result.success && result.data) {
          setProjects(result.data);
        } else {
          setProjects([]);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        setProjects([]);
      }
    };
    fetchCourseProjects();
  }, [selectedCourseId]);

  const handleSubmit = async (data: SubmitProjectFormData) => {
    console.log(data);
    try {
      console.log("submiting project:", data);

      // Call the create category action
      const result = await submitProject(data);

      if (result.success) {
        toast.success("Success", {
          description: "Project submitted successfully",
        });

        // Reset form
        form.reset();
      } else {
        toast.error("Error", {
          description:
            result.error || "Failed to submit project. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error submitting project:", error);
      toast.error("Error", {
        description: "Failed to submit project. Please try again.",
      });
    }
  };

  return (
    <Card className="w-full sm:max-w-2xl">
      <CardContent>
        <form
          id="submit-project-form"
          className="space-y-4"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <Controller
            name={"courseId" as const}
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={`submit-project-${field}`}>
                  Course <span className="text-orange-600">*</span>
                </FieldLabel>
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    setSelectedCourseId(value);
                  }}
                  disabled={courses.length === 0}
                >
                  <SelectTrigger
                    className="w-full"
                    id={`submit-project-${field}`}
                  >
                    <SelectValue placeholder="Select Course" />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          {selectedCourseId && (
            <Controller
              name={"projectId" as const}
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={`submit-project-${field}`}>
                    Project <span className="text-orange-600">*</span>
                  </FieldLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={projects.length === 0}
                  >
                    <SelectTrigger
                      className="w-full"
                      id={`submit-project-${field}`}
                    >
                      <SelectValue placeholder="Select Project" />
                    </SelectTrigger>
                    <SelectContent className="w-full">
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          )}
          <Controller
            name={"repoLink" as const}
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="student-id">Github Link</FieldLabel>
                <InputGroup>
                  <Input
                    {...field}
                    id="student-id"
                    placeholder="Github Link (optional)"
                    aria-invalid={fieldState.invalid}
                  />
                </InputGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name={"demoLink" as const}
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="student-id">
                  Live Preview <span className="text-orange-600">*</span>
                </FieldLabel>
                <InputGroup>
                  <Input
                    {...field}
                    id="student-id"
                    placeholder="Live Preview"
                    aria-invalid={fieldState.invalid}
                  />
                </InputGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </form>
      </CardContent>
      <CardFooter className="flex justify-end items-center w-full gap-4">
        <DialogClose asChild>
          <Button variant={"outline"}>Cancel</Button>
        </DialogClose>
        <Button
          type="submit"
          form="submit-project-form"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "submitting..." : "Submit Project"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SubmitProjectForm;
