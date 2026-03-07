"use server";

import action from "../handlers/action";
import {
  CreateCourseSchema,
  PaginatedSearchParamsSchema,
} from "../validations";
import { db } from "../db";
import { courses, categories, enrollments } from "../schema";
import { revalidatePath } from "next/cache";
import handleError from "../handlers/error";
import {
  CreateCourseParams,
  Course,
  PaginatedResponse,
} from "@/types/action.d";
import {
  eq,
  ilike,
  desc,
  asc,
  and,
  or,
  count,
  getTableColumns,
  sql,
} from "drizzle-orm";
import { auth } from "@/auth";

// ─── Types ────────────────────────────────────────────────────────────────────

export type CourseWithCategory = Course & {
  category: {
    id: string;
    name: string;
    description: string | null;
    icon: string | null;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
  } | null;
};

export type StudentCourse = CourseWithCategory & {
  enrolledAt: Date;
};

// ─── Create ───────────────────────────────────────────────────────────────────

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
    const [newCourse] = await db
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
        instructorId: session.user.id,
      })
      .returning();

    revalidatePath("/admin/courses");

    return { success: true, data: newCourse as Course };
  } catch (error) {
    console.error("Error creating course:", error);
    return handleError(error) as ErrorResponse;
  }
}

// ─── Get All (admin / public browse) ─────────────────────────────────────────

export async function getAllCourses(
  params: PaginatedSearchParams,
): Promise<PaginatedResponse<CourseWithCategory>> {
  const validationResult = await action({
    params,
    schema: PaginatedSearchParamsSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const {
    page = 1,
    pageSize = 10,
    query,
    filter,
    sort = "created-desc",
  } = params;
  const offset = (page - 1) * pageSize;

  try {
    const whereConditions = [eq(courses.isDeleted, false)];

    if (query) {
      const searchCondition = or(
        ilike(courses.title, `%${query}%`),
        ilike(courses.description, `%${query}%`),
      );
      if (searchCondition) whereConditions.push(searchCondition);
    }

    if (filter) whereConditions.push(eq(courses.categoryId, filter));

    const orderByClause = buildCourseOrderBy(sort);

    // Correct total count using count()
    const [{ total }] = await db
      .select({ total: count() })
      .from(courses)
      .where(and(...whereConditions));

    const allCourses = await db
      .select({
        ...getTableColumns(courses),
        category: { ...getTableColumns(categories) },
      })
      .from(courses)
      .leftJoin(categories, eq(courses.categoryId, categories.id))
      .where(and(...whereConditions))
      .orderBy(orderByClause)
      .limit(pageSize)
      .offset(offset);

    return {
      success: true,
      data: allCourses as CourseWithCategory[],
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
        isNext: total > page * pageSize,
      },
    };
  } catch (error) {
    console.error("Error getting courses:", error);
    return handleError(error) as ErrorResponse;
  }
}

// ─── Get Current Student's Enrolled Courses ───────────────────────────────────

export async function getStudentCourses(
  params: PaginatedSearchParams,
): Promise<PaginatedResponse<StudentCourse>> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      error: "Unauthorized",
      pagination: {
        page: 1,
        pageSize: 10,
        total: 0,
        totalPages: 0,
        isNext: false,
      },
    };
  }

  const validationResult = await action({
    params,
    schema: PaginatedSearchParamsSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const {
    page = 1,
    pageSize = 10,
    query,
    filter,
    sort = "created-desc",
  } = params;
  const offset = (page - 1) * pageSize;

  try {
    const whereConditions = [
      eq(enrollments.studentId, session.user.id),
      eq(courses.isDeleted, false),
    ];

    if (query) {
      const searchCondition = or(
        ilike(courses.title, `%${query}%`),
        ilike(courses.description, `%${query}%`),
      );
      if (searchCondition) whereConditions.push(searchCondition);
    }

    if (filter) whereConditions.push(eq(courses.categoryId, filter));

    const orderByClause = buildCourseOrderBy(sort);

    const [{ total }] = await db
      .select({ total: count() })
      .from(enrollments)
      .innerJoin(courses, eq(enrollments.courseId, courses.id))
      .where(and(...whereConditions));

    const studentCourses = await db
      .select({
        ...getTableColumns(courses),
        category: { ...getTableColumns(categories) },
        enrolledAt: enrollments.enrolledAt,
      })
      .from(enrollments)
      .innerJoin(courses, eq(enrollments.courseId, courses.id))
      .leftJoin(categories, eq(courses.categoryId, categories.id))
      .where(and(...whereConditions))
      .orderBy(orderByClause)
      .limit(pageSize)
      .offset(offset);

    return {
      success: true,
      data: studentCourses as StudentCourse[],
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
        isNext: total > page * pageSize,
      },
    };
  } catch (error) {
    console.error("Error getting student courses:", error);
    return handleError(error) as ErrorResponse;
  }
}

// ─── Delete ───────────────────────────────────────────────────────────────────

export async function deleteCourse(
  courseId: string,
): Promise<ActionResponse<Course>> {
  try {
    const [deletedCourse] = await db
      .delete(courses)
      .where(eq(courses.id, courseId))
      .returning();

    if (!deletedCourse) {
      return handleError(new Error("Course not found")) as ErrorResponse;
    }

    revalidatePath("/admin/courses");

    return { success: true, data: deletedCourse as Course };
  } catch (error) {
    console.error("Error deleting course:", error);
    return handleError(error) as ErrorResponse;
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildCourseOrderBy(sort: string) {
  switch (sort) {
    case "title-asc":
      return asc(courses.title);
    case "title-desc":
      return desc(courses.title);
    case "price-asc":
      return asc(courses.price);
    case "price-desc":
      return desc(courses.price);
    case "created-asc":
      return asc(courses.createdAt);
    case "created-desc":
    default:
      return desc(courses.createdAt);
  }
}
