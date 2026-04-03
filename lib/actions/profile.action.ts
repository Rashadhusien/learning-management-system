"use server";

import action from "../handlers/action";
import handleError from "../handlers/error";
import { GetProfileSchema, UpdateProfileSchema } from "../validations";
import { db } from "../db";
import { users } from "../schema";
import { eq } from "drizzle-orm";
import { User } from "@/types/action";
import { revalidatePath } from "next/cache";
import { ROUTES } from "@/constants/routes";

export async function getProfile(params: {
  userId: string;
}): Promise<ActionResponse<User>> {
  const validationResult = await action({
    params,
    schema: GetProfileSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return { success: false, error: { message: "Validation failed" } };
  }

  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, params.userId));

    if (user[0]) {
      // Convert null level to empty string to match User type
      const userData: User = {
        ...user[0],
        level: user[0].level || "",
      };
      return { success: true, data: userData };
    }

    return { success: false, error: { message: "User not found" } };
  } catch (error) {
    console.error("Error fetching profile:", error);
    return { success: false, error: { message: "Failed to fetch profile" } };
  }
}

export async function updateProfile(params: {
  userId: string;
  name?: string;
  username?: string;
  email?: string;
  bio?: string;
  phone?: string;
  level?: string;
  imageCldPubId?: string | null;
  coverCldPubId?: string | null;
}): Promise<ActionResponse<User>> {
  const validationResult = await action({
    params,
    schema: UpdateProfileSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return { success: false, error: { message: "Validation failed" } };
  }

  try {
    const { userId, ...updateData } = params;

    // Check if user exists and is active
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!existingUser) {
      return { success: false, error: { message: "User not found" } };
    }

    if (!existingUser.active) {
      return { success: false, error: { message: "Account is not active" } };
    }

    const updatedUser = await db
      .update(users)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();

    revalidatePath(ROUTES.PROFILE);

    if (updatedUser[0]) {
      const userData: User = {
        ...updatedUser[0],
        level: updatedUser[0].level || "",
      };
      return { success: true, data: userData };
    }

    return { success: false, error: { message: "Failed to update profile" } };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { success: false, error: { message: "Failed to update profile" } };
  }
}
