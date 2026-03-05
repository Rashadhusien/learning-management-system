"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import type { Resolver } from "react-hook-form";
import { createCategory } from "@/lib/actions/categories.action";

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
import { Textarea } from "@/components/ui/textarea";
import { ROUTES } from "@/constants/routes";

import { CreateCategorySchema } from "@/lib/validations";

type CreateCategoryFormData = z.infer<typeof CreateCategorySchema>;

const CreateCategoryForm = () => {
  const router = useRouter();

  const form = useForm<CreateCategoryFormData>({
    resolver: zodResolver(CreateCategorySchema) as Resolver<CreateCategoryFormData>,
    defaultValues: {
      name: "",
      description: "",
      icon: "",
    },
  });

  const handleSubmit = async (data: CreateCategoryFormData) => {
    try {
      console.log("Creating category:", data);

      // Call the create category action
      const result = await createCategory(data);

      if (result.success) {
        toast.success("Success", {
          description: "Category created successfully",
        });

        // Reset form
        form.reset();

        router.push(ROUTES.ADMIN_CATEGORIES || "/admin/categories");
      } else {
        toast.error("Error", {
          description:
            result.error?.message ||
            "Failed to create category. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("Error", {
        description: "Failed to create category. Please try again.",
      });
    }
  };

  return (
    <Card className="w-full sm:max-w-xl">
      <CardHeader>
        <CardTitle>Create Category</CardTitle>
        <CardDescription>
          Fill in the details to create a new category
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="create-category-form"
          className="space-y-4"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <Controller
            name={"name" as const}
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={`create-category-${field}`}>
                  Name <span className="text-orange-600">*</span>
                </FieldLabel>
                <InputGroup>
                  <Input
                    {...field}
                    id={`create-category-${field}`}
                    type={"text"}
                    placeholder={"Category name"}
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
                <FieldLabel htmlFor="category-description">
                  Description
                </FieldLabel>
                <InputGroup>
                  <Textarea
                    {...field}
                    id="category-description"
                    placeholder="Category description (optional)"
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
            name="icon"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="category-icon">
                  Icon
                </FieldLabel>
                <InputGroup>
                  <Input
                    {...field}
                    id="category-icon"
                    type="text"
                    placeholder="Icon name or URL (optional)"
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
      <CardFooter>
        <div className="w-full space-y-4">
          <Button
            type="submit"
            form="create-category-form"
            disabled={form.formState.isSubmitting}
            className="w-full"
          >
            {form.formState.isSubmitting ? "Creating..." : "Create Category"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CreateCategoryForm;
