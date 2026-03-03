"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DefaultValues,
  FieldValues,
  Path,
  SubmitHandler,
  useForm,
  Controller,
} from "react-hook-form";
import { toast } from "sonner";
import { ZodType, Resolver } from "zod";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup } from "@/components/ui/input-group";

import { ROUTES } from "@/constants/routes";
import { RiEyeLine, RiEyeOffLine } from "@remixicon/react";
import { cn } from "@/lib/utils";

interface AuthFormProps<T extends FieldValues> {
  schema: ZodType<T, unknown, any>;
  defaultValues: T;
  onSubmit: (data: T) => Promise<ActionResponse>;
  formType: "SIGN_IN" | "SIGN_UP";
}

const AuthForm = <T extends FieldValues>({
  schema,
  defaultValues,
  formType,
  onSubmit,
}: AuthFormProps<T>) => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<T>({
    resolver: zodResolver(schema) as Resolver<T>,
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const handleSubmit: SubmitHandler<T> = async (data) => {
    const result = (await onSubmit(data)) as ActionResponse;

    if (result?.success) {
      toast.success("Success", {
        description:
          formType === "SIGN_IN"
            ? "Signed in successfully"
            : "Account created successfully",
      });
      router.push(ROUTES.HOME);
    } else {
      toast.error(`Error: ${result?.status}`, {
        description: result?.error?.message,
      });
    }
  };

  const buttonText = formType === "SIGN_IN" ? "Sign In" : "Sign Up";

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>{buttonText}</CardTitle>
        <CardDescription>
          {formType === "SIGN_IN"
            ? "Enter your credentials to access your account"
            : "Create a new account to get started"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="auth-form" onSubmit={form.handleSubmit(handleSubmit)}>
          <FieldGroup>
            {Object.keys(defaultValues).map((field) => (
              <Controller
                key={field}
                name={field as Path<T>}
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={`auth-${field}`}>
                      {field.name === "email"
                        ? "Email Address"
                        : field.name === "username"
                          ? "Username"
                          : field.name === "name"
                            ? "Full Name"
                            : field.name.charAt(0).toUpperCase() +
                              field.name.slice(1)}
                    </FieldLabel>
                    <InputGroup>
                      <Input
                        {...field}
                        id={`auth-${field}`}
                        type={
                          field.name === "password"
                            ? showPassword
                              ? "text"
                              : "password"
                            : "text"
                        }
                        placeholder={`Enter your ${field.name}`}
                        aria-invalid={fieldState.invalid}
                        autoComplete={
                          field.name === "email"
                            ? "email"
                            : field.name === "password"
                              ? "current-password"
                              : field.name === "name"
                                ? "name"
                                : "off"
                        }
                      />
                      {field.name === "password" && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8"
                          onClick={() => setShowPassword(!showPassword)}
                          tabIndex={-1}
                        >
                          {showPassword ? (
                            <RiEyeOffLine
                              size={18}
                              className={cn("text-gray-500")}
                            />
                          ) : (
                            <RiEyeLine
                              size={18}
                              className={cn("text-gray-500")}
                            />
                          )}
                        </Button>
                      )}
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            ))}
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <div className="w-full space-y-4">
          <Button
            type="submit"
            form="auth-form"
            disabled={form.formState.isSubmitting}
            className="w-full"
          >
            {form.formState.isSubmitting
              ? buttonText === "Sign In"
                ? "Signing In..."
                : "Signing Up..."
              : buttonText}
          </Button>

          {formType === "SIGN_IN" ? (
            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href={ROUTES.REGISTER}
                className="font-semibold text-primary hover:underline"
              >
                Sign Up
              </Link>
            </p>
          ) : (
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href={ROUTES.LOGIN}
                className="font-semibold text-primary hover:underline"
              >
                Sign In
              </Link>
            </p>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default AuthForm;
