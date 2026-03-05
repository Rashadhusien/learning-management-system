"use server";

import action from "../handlers/action";
import handleError from "../handlers/error";
import { GetProfileSchema } from "../validations";
import { db } from "../db";
import { users } from "../schema";
import { eq } from "drizzle-orm";
import { User } from "@/types/action";
export async function getProfile(params: {
  userId: string;
}): Promise<ActionResponse<User>> {
  const validationResult = await action({
    params,
    schema: GetProfileSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, params.userId));
    return { success: true, data: user[0] };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
