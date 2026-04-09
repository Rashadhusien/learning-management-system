"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";

import type { Resolver } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup } from "@/components/ui/input-group";
import { CreateChapterInput, createChapterSchema } from "@/lib/validations";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { BookOpen, Loader2, ListOrdered } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { createChapter } from "@/lib/actions/lectures.action";

const CreateChapterForm = ({
  courseId,
  children,
}: {
  courseId: string;
  children: React.ReactNode;
}) => {
  const form = useForm<CreateChapterInput>({
    resolver: zodResolver(createChapterSchema) as Resolver<CreateChapterInput>,
    defaultValues: { courseId: courseId, title: "", order: 0, description: "" },
  });

  const handleSubmit = async (data: CreateChapterInput) => {
    console.log(data);

    try {
      const result = await createChapter(data);
      if (result.success) {
        toast.success("Chapter created successfully");

        form.reset();
      } else {
        toast.error(result.error || "Failed to create chapter");
      }
    } catch (error) {
      console.log(error);
      toast.error("An unexpected error occurred");
    }
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Chapter</DialogTitle>
          <DialogDescription>
            Add a new chapter to organize your course content.
          </DialogDescription>
        </DialogHeader>
        <form
          id="create-chapter-form"
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-5"
        >
          <Controller
            name="title"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor="field-title"
                  className="body-medium text-foreground flex items-center gap-1.5 mb-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5 text-primary" />
                  Chapter Title
                </FieldLabel>
                <InputGroup>
                  <Input
                    {...field}
                    id="field-title"
                    placeholder="Chapter Title"
                    aria-invalid={fieldState.invalid}
                    className="h-10 rounded-xl border-border bg-background text-sm
                              placeholder:text-muted-foreground/50 no-focus
                              focus-visible:ring-1 focus-visible:ring-primary/30
                              focus-visible:border-primary/60 transition-all"
                  />
                </InputGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="order"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor="field-order"
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
                    {...field}
                    id="field-order"
                    type="number"
                    placeholder="Chapter Order"
                    aria-invalid={fieldState.invalid}
                    className="h-10 rounded-xl border-border bg-background text-sm
                              placeholder:text-muted-foreground/50 no-focus
                              focus-visible:ring-1 focus-visible:ring-primary/30
                              focus-visible:border-primary/60 transition-all"
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
                <FieldLabel
                  htmlFor="field-description"
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
                    id="field-description"
                    placeholder="pref about the chapter"
                    aria-invalid={fieldState.invalid}
                    className="h-10 rounded-xl border-border bg-background no-scrollbar text-sm
                              placeholder:text-muted-foreground/50 no-focus
                              focus-visible:ring-1 focus-visible:ring-primary/30
                              focus-visible:border-primary/60 transition-all"
                  />
                </InputGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Divider */}
          <div className="h-px bg-border" />
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="ghost"
              className="gap-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            form="create-chapter-form"
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
              <>Create Chapter</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateChapterForm;
