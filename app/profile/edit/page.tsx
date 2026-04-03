"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EditProfileSchema } from "@/lib/validations";
import { Controller } from "react-hook-form";
import { Field, FieldLabel } from "@/components/ui/field";
import { InputGroup } from "@/components/ui/input-group";
import z from "zod";
import ProfileImageUpload from "@/components/ProfileImageUpload";
import CoverImageUpload from "@/components/CoverImageUpload";
import { constructCloudinaryUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "@/lib/actions/profile.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
const EditProfilePage = () => {
  const router = useRouter();

  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(EditProfileSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      bio: "",
      phone: "",
      level: "",
      imageCldPubId: "",
      coverCldPubId: "",
    },
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (status === "loading") return; // Don't do anything while loading

      if (status === "authenticated" && session?.user?.id) {
        try {
          const response = await getProfile({ userId: session.user.id });
          const result = response;

          if (result.success && result.data) {
            const userProfile = result.data;
            form.reset({
              name: userProfile.name || "",
              username: userProfile.username || "",
              email: userProfile.email || "",
              bio: userProfile.bio || "",
              phone: userProfile.phone || "",
              level: userProfile.level || "",
              imageCldPubId: userProfile.imageCldPubId || "",
              coverCldPubId: userProfile.coverCldPubId || "",
            });
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      }
    };
    fetchUserProfile();
  }, [form, session?.user?.id, status]);

  const onSubmit = async (data: z.infer<typeof EditProfileSchema>) => {
    console.log("Form submitted", data);
    setIsLoading(true);

    try {
      if (!session?.user?.id) {
        throw new Error("User not authenticated");
      }

      const { success } = await updateProfile({
        userId: session.user.id,
        name: data.name,
        username: data.username,
        email: data.email,
        bio: data.bio,
        phone: data.phone,
        level: data.level,
        imageCldPubId: data.imageCldPubId || null,
        coverCldPubId: data.coverCldPubId || null,
      });

      if (success) {
        console.log("Profile updated successfully");
        // Redirect back to profile page or show success message
        toast.success("Profile updated successfully");

        router.push("/profile");
      } else {
        console.error("Failed to update profile");
        // Show error message to user
        toast.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {status === "loading" ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-muted-foreground">Loading profile...</div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">
                Edit Profile
              </h1>
              <p className="text-muted-foreground">
                Update your personal information and profile settings.
              </p>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-2">
                <Controller
                  name="coverCldPubId"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="coverCldPubId">
                        Cover Image
                      </FieldLabel>

                      <CoverImageUpload
                        value={
                          field.value
                            ? {
                                url: constructCloudinaryUrl(field.value),
                                publicId: field.value,
                              }
                            : null
                        }
                        onChange={(value) =>
                          field.onChange(value?.publicId || "")
                        }
                      />
                    </Field>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Controller
                  name="imageCldPubId"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="imageCldPubId">
                        Profile Picture
                      </FieldLabel>

                      <ProfileImageUpload
                        value={
                          field.value
                            ? {
                                url: constructCloudinaryUrl(field.value),
                                publicId: field.value,
                              }
                            : null
                        }
                        onChange={(value) =>
                          field.onChange(value?.publicId || "")
                        }
                        userName={form.getValues("name") || ""}
                      />
                    </Field>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Controller
                    name="name"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="name">Full Name</FieldLabel>
                        <InputGroup>
                          <Input
                            {...field}
                            id="name"
                            placeholder="Enter your full name"
                          />
                        </InputGroup>
                      </Field>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Controller
                    name="username"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="username">Username</FieldLabel>
                        <InputGroup>
                          <Input
                            {...field}
                            id="username"
                            placeholder="Enter your username"
                          />
                        </InputGroup>
                      </Field>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Controller
                    name="email"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="email">Email</FieldLabel>
                        <InputGroup>
                          <Input
                            {...field}
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                          />
                        </InputGroup>
                      </Field>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Controller
                    name="phone"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="phone">
                          Phone (Optional)
                        </FieldLabel>
                        <InputGroup>
                          <Input
                            {...field}
                            id="phone"
                            placeholder="Enter your phone number"
                          />
                        </InputGroup>
                      </Field>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Controller
                    name="level"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="level">Level</FieldLabel>
                        <InputGroup>
                          <Input
                            {...field}
                            id="level"
                            placeholder="Enter your level"
                          />
                        </InputGroup>
                      </Field>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Controller
                  name="bio"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="bio">Bio</FieldLabel>
                      <InputGroup>
                        <Textarea
                          {...field}
                          id="bio"
                          placeholder="Tell us about yourself..."
                          rows={3}
                          className="resize-none"
                        />
                      </InputGroup>
                    </Field>
                  )}
                />
                <p className="text-xs text-muted-foreground">
                  {form.watch("bio")?.length || 0}/500 characters
                </p>
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isLoading}
                  onClick={() => window.history.back()}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditProfilePage;
