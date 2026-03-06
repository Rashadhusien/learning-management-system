"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import type { Resolver } from "react-hook-form";

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

import { CreateAchievementSchema } from "@/lib/validations";
import { Textarea } from "@/components/ui/textarea";
import ImageUploadWidget from "@/components/upload-widget";
import { ROUTES } from "@/constants/routes";
import { createAchievement } from "@/lib/actions/achievements.action";

type CreateAchievementFormData = z.infer<typeof CreateAchievementSchema> & {
  bannerCldPubId?: string;
};

const CreateAchievementForm = () => {
  const router = useRouter();
  const [bannerPublicId, setBannerPublicId] = useState<string>("");

  const form = useForm<CreateAchievementFormData>({
    resolver: zodResolver(
      CreateAchievementSchema,
    ) as Resolver<CreateAchievementFormData>,
    defaultValues: {
      title: "",
      description: "",
      imageCldPubId: "",
      requiredPoints: 0,
    },
  });

  const handleSubmit = async (data: CreateAchievementFormData) => {
    try {
      console.log("Creating achievement:", data);

      // Check if banner is required but not uploaded
      if (!data.imageCldPubId) {
        toast.error("Error", {
          description: "Banner image is required. Please upload an image.",
        });
        return;
      }

      const result = await createAchievement({
        title: data.title,
        description: data.description,
        imageCldPubId: data.imageCldPubId,
        requiredPoints: data.requiredPoints,
      });

      if (result.success) {
        toast.success("Success", {
          description: "Achievement created successfully!",
        });
        router.push(ROUTES.ADMIN_ACHIEVEMENTS);
      } else {
        const errorMessage =
          typeof result.error === "string"
            ? result.error
            : result.error?.message ||
              "Failed to create Achievement. Please try again.";

        toast.error("Error", {
          description: errorMessage,
        });
      }
    } catch (error: unknown) {
      console.error("Error creating achievement:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to create achievement. Please try again.";
      toast.error("Error", {
        description: errorMessage,
      });
    }
  };

  return (
    <Card className="w-full sm:max-w-xl">
      <CardHeader>
        <CardTitle>Create Achievement</CardTitle>
        <CardDescription>
          Fill in the details to create a new achievement
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="create-achievement-form"
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
                <FieldLabel htmlFor={`create-achievement-${field}`}>
                  Title
                </FieldLabel>
                <InputGroup>
                  <Input
                    {...field}
                    id={`create-achievement-${field}`}
                    type={"text"}
                    placeholder={"achievement title"}
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
                <FieldLabel htmlFor="achievement-description">
                  Description
                </FieldLabel>
                <InputGroup>
                  <Textarea
                    {...field}
                    id="achievement-description"
                    placeholder="achievement description"
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
            name="requiredPoints"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="achievement-points">Points</FieldLabel>
                <InputGroup>
                  <Input
                    {...field}
                    id="achievement-points"
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
        </form>
      </CardContent>
      <CardFooter>
        <div className="w-full space-y-4">
          <Button
            type="submit"
            form="create-achievement-form"
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

export default CreateAchievementForm;
