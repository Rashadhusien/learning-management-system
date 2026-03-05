"use server";

import action from "../handlers/action";
import { CreateCourseSchema } from "../validations";
import { db } from "../db";
import { courses, categories } from "../schema";
import { revalidatePath } from "next/cache";
import handleError from "../handlers/error";
import { CreateCourseParams, Course } from "@/types/action.d";
import { eq } from "drizzle-orm";

// Create Course
export async function createCourse(
  params: CreateCourseParams,
): Promise<ActionResponse<Course>> {
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
        categoryId: validatedData.categoryId,
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

// get all Courses with category information
export async function getAllCourses(): Promise<ActionResponse<Course[]>> {
  try {
    const allCourses = await db
      .select({
        id: courses.id,
        title: courses.title,
        description: courses.description,
        price: courses.price,
        isPublished: courses.isPublished,
        bannerUrl: courses.bannerUrl,
        duration: courses.duration,
        level: courses.level,
        categoryId: courses.categoryId,
        instructorId: courses.instructorId,
        isDeleted: courses.isDeleted,
        createdAt: courses.createdAt,
        updatedAt: courses.updatedAt,
        category: {
          id: categories.id,
          name: categories.name,
        },
      })
      .from(courses)
      .leftJoin(categories, eq(courses.categoryId, categories.id))
      .where(eq(courses.isDeleted, false));

    return {
      success: true,
      data: allCourses as Course[],
    };
  } catch (error) {
    console.error("Error getting courses:", error);
    return handleError(error) as ErrorResponse;
  }
}

// // get Courses by category
// export async function getCoursesByCategory(
//   categoryId: string,
// ): Promise<ActionResponse<Course[]>> {
//   try {
//     const categoryCourses = await db
//       .select({
//         id: courses.id,
//         title: courses.title,
//         description: courses.description,
//         price: courses.price,
//         isPublished: courses.isPublished,
//         bannerUrl: courses.bannerUrl,
//         duration: courses.duration,
//         level: courses.level,
//         categoryId: courses.categoryId,
//         instructorId: courses.instructorId,
//         isDeleted: courses.isDeleted,
//         createdAt: courses.createdAt,
//         updatedAt: courses.updatedAt,
//         category: {
//           id: categories.id,
//           name: categories.name,
//           description: categories.description,
//           icon: categories.icon,
//         },
//       })
//       .from(courses)
//       .leftJoin(categories, eq(courses.categoryId, categories.id))
//       .where(eq(courses.categoryId, categoryId))
//       .where(eq(courses.isDeleted, false));

//     return {
//       success: true,
//       data: categoryCourses as Course[],
//     };
//   } catch (error) {
//     console.error("Error getting courses by category:", error);
//     return handleError(error) as ErrorResponse;
//   }
// }

// // get Course by ID with category
// export async function getCourseById(
//   courseId: string,
// ): Promise<ActionResponse<Course>> {
//   try {
//     const course = await db
//       .select({
//         id: courses.id,
//         title: courses.title,
//         description: courses.description,
//         price: courses.price,
//         isPublished: courses.isPublished,
//         bannerUrl: courses.bannerUrl,
//         duration: courses.duration,
//         level: courses.level,
//         categoryId: courses.categoryId,
//         instructorId: courses.instructorId,
//         isDeleted: courses.isDeleted,
//         createdAt: courses.createdAt,
//         updatedAt: courses.updatedAt,
//         category: {
//           id: categories.id,
//           name: categories.name,
//           description: categories.description,
//           icon: categories.icon,
//         },
//       })
//       .from(courses)
//       .leftJoin(categories, eq(courses.categoryId, categories.id))
//       .where(eq(courses.id, courseId))
//       .limit(1);

//     if (course.length === 0) {
//       return handleError(new Error("Course not found")) as ErrorResponse;
//     }

//     return {
//       success: true,
//       data: course[0] as Course,
//     };
//   } catch (error) {
//     console.error("Error getting course by ID:", error);
//     return handleError(error) as ErrorResponse;
//   }
// }

// Delete Course
export async function deleteCourse(
  courseId: string,
): Promise<ActionResponse<Course>> {
  try {
    const deletedCourse = await db
      .delete(courses)
      .where(eq(courses.id, courseId))
      .returning();

    if (deletedCourse.length === 0) {
      return handleError(new Error("Course not found")) as ErrorResponse;
    }

    revalidatePath("/admin/courses");

    return {
      success: true,
      data: deletedCourse[0] as Course,
    };
  } catch (error) {
    console.error("Error deleting course:", error);
    return handleError(error) as ErrorResponse;
  }
}
