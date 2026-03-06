"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { z } from "zod";
import type { Resolver } from "react-hook-form";
import { createProject } from "@/lib/actions/projects.action";
import { getAllCourses } from "@/lib/actions/courses.action";
import { Course } from "@/types/action.d";

interface UploadWidgetValue {
  url: string;
  publicId: string;
  sizeBytes?: number;
  mimeType?: string;
}

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup } from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { CreateProjectSchema } from "@/lib/validations";
import { Textarea } from "@/components/ui/textarea";
import ImageUploadWidget from "@/components/upload-widget";
import { ROUTES } from "@/constants/routes";

type CreateProjectFormData = z.infer<typeof CreateProjectSchema> & {
  bannerCldPubId?: string;
};

const CreateProjectForm = () => {
  const router = useRouter();
  const [bannerPublicId, setBannerPublicId] = useState<string>("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  const form = useForm<CreateProjectFormData>({
    resolver: zodResolver(
      CreateProjectSchema,
    ) as Resolver<CreateProjectFormData>,
    defaultValues: {
      title: "",
      description: "",
      imageCldPubId: "",
      points: 50,
      classId: "",
    },
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const result = await getAllCourses();
        if (result.success && result.data) {
          setCourses(result.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchCourses();
  }, []);

  const handleSubmit = async (data: CreateProjectFormData) => {
    try {
      console.log("Creating project:", data);

      // Check if banner is required but not uploaded
      if (!data.imageCldPubId) {
        toast.error("Error", {
          description: "Banner image is required. Please upload an image.",
        });
        return;
      }

      // Call the create project action
      const result = await createProject({
        title: data.title,
        description: data.description,
        imageCldPubId: data.imageCldPubId,
        points: data.points,
        classId: data.classId,
      });

      if (result.success) {
        toast.success("Success", {
          description: "Project created successfully!",
        });
        router.push("/admin/projects");
      } else {
        const errorMessage =
          typeof result.error === "string"
            ? result.error
            : result.error?.message ||
              "Failed to create project. Please try again.";

        toast.error("Error", {
          description: errorMessage,
        });
      }
    } catch (error: unknown) {
      console.error("Error creating project:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to create project. Please try again.";
      toast.error("Error", {
        description: errorMessage,
      });
    }
  };

  return (
    <Card className="w-full sm:max-w-xl">
      <CardHeader>
        <CardTitle>Create Course</CardTitle>
        <CardDescription>
          Fill in the details to create a new course
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="create-course-form"
          className="space-y-4"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <Controller
            control={form.control}
            name="imageCldPubId"
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>
                  Banner Image <span className="text-orange-600">*</span>
                </FieldLabel>
                <ImageUploadWidget
                  value={
                    field.value
                      ? {
                          url: field.value,
                          publicId: bannerPublicId ?? "",
                        }
                      : null
                  }
                  onChange={(file: UploadWidgetValue | null) => {
                    if (file) {
                      field.onChange(file.url);
                      form.setValue("bannerCldPubId", file.publicId, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                      setBannerPublicId(file.publicId);
                    } else {
                      field.onChange("");
                      form.setValue("bannerCldPubId", "", {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                      setBannerPublicId("");
                    }
                  }}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}{" "}
              </Field>
            )}
          />

          <Controller
            name={"title" as const}
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={`create-course-${field}`}>
                  Title
                </FieldLabel>
                <InputGroup>
                  <Input
                    {...field}
                    id={`create-course-${field}`}
                    type={"text"}
                    placeholder={"Course title"}
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
            name="description"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="course-description">
                  Description
                </FieldLabel>
                <InputGroup>
                  <Textarea
                    {...field}
                    id="course-description"
                    placeholder="Course description"
                    aria-invalid={fieldState.invalid}
                  />
                </InputGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="points"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="course-points">Points</FieldLabel>
                  <InputGroup>
                    <Input
                      {...field}
                      id="course-points"
                      type="number"
                      min="0"
                      placeholder="0"
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 0)
                      }
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
              name="classId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="course-category">Category</FieldLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={loadingCourses}
                  >
                    <SelectTrigger id="course-category">
                      <SelectValue
                        placeholder={
                          loadingCourses ? "Loading..." : "Select category"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
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
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <div className="w-full space-y-4">
          <Button
            type="submit"
            form="create-course-form"
            disabled={form.formState.isSubmitting}
            className="w-full"
          >
            {form.formState.isSubmitting ? "Creating..." : "Create"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CreateProjectForm;
