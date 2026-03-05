"use server";

import action from "../handlers/action";
import { CreateCourseSchema } from "../validations";
import { db } from "../db";
import { courses } from "../schema";
import { revalidatePath } from "next/cache";
import handleError from "../handlers/error";

// Create Course
export async function createCourse(
  params: CreateCourseParams,
): Promise<ActionResponse> {
  const validationResult = await action({
    params,
    schema: CreateCourseSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { params: validatedData, session } = validationResult;

  if (!validatedData || !session?.user?.id) {
    return handleError(
      new Error("Validation failed or user not authenticated"),
    ) as ErrorResponse;
  }

  try {
    const newCourse = await db
      .insert(courses)
      .values({
        title: validatedData.title,
        description: validatedData.description,
        price: validatedData.price,
        duration: validatedData.duration,
        level: validatedData.level,
        category: validatedData.category,
        bannerUrl: validatedData.bannerUrl,
        isPublished: validatedData.isPublished,
        instructorId: session.user.id, // Get instructorId from session
      })
      .returning();

    revalidatePath("/admin/courses");

    return {
      success: true,
      data: newCourse[0] as Course,
    };
  } catch (error) {
    console.error("Error creating course:", error);
    return handleError(error) as ErrorResponse;
  }
}

// get all Courses
export async function getAllCourses(): Promise<ActionResponse> {
  try {
    const allCourses = await db.select().from(courses);
    return {
      success: true,
      data: allCourses as Course[],
    };
  } catch (error) {
    console.error("Error getting courses:", error);
    return handleError(error) as ErrorResponse;
  }
}
