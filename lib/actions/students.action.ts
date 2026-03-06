"use server";

import { PaginatedResponse, User, ActionResponse } from "@/types/action";
import action from "../handlers/action";
import { PaginatedSearchParamsSchema } from "../validations";
import { and, asc, desc, eq, ilike, or, getTableColumns } from "drizzle-orm";
import { users } from "../schema";
import { db } from "../db";

export async function getAllStudents(
  params: PaginatedSearchParams,
): Promise<PaginatedResponse<User>> {
  const validationResult = await action({
    params,
    schema: PaginatedSearchParamsSchema,
  });
  if (validationResult instanceof Error) {
    return {
      success: false,
      error: "Validation failed",
      pagination: {
        page: 1,
        pageSize: 10,
        total: 0,
        totalPages: 0,
        isNext: false,
      },
    };
  }

  const { page = 1, pageSize = 10, query, sort = "created-desc" } = params;
  const offset = (page - 1) * pageSize;

  try {
    const whereConditions = [eq(users.role, "student")];

    if (query) {
      const searchCondition = or(
        ilike(users.name, `%${query}%`),
        ilike(users.email, `%${query}%`),
        ilike(users.username, `%${query}%`),
      );
      if (searchCondition) {
        whereConditions.push(searchCondition);
      }
    }

    let orderByClause;
    switch (sort) {
      case "created-desc":
        orderByClause = desc(users.createdAt);
        break;
      case "created-asc":
        orderByClause = asc(users.createdAt);
        break;
      case "points-desc":
        orderByClause = desc(users.totalPoints);
        break;
      case "points-asc":
        orderByClause = asc(users.totalPoints);
        break;
      default:
        orderByClause = desc(users.createdAt);
    }

    const allStudents = await db
      .select({ count: users.id })
      .from(users)
      .where(and(...whereConditions));

    const total = allStudents.length;

    const students = await db
      .select({
        ...getTableColumns(users),
      })
      .from(users)
      .where(and(...whereConditions))
      .orderBy(orderByClause)
      .limit(pageSize)
      .offset(offset);

    const totalPages = Math.ceil(total / pageSize);

    const isNext = total > page * pageSize;

    return {
      success: true,
      data: students,
      pagination: {
        page,
        pageSize,
        total,
        totalPages,
        isNext,
      },
    };
  } catch {
    return {
      success: false,
      error: "Failed to fetch students",
      pagination: {
        page: 1,
        pageSize: 10,
        total: 0,
        totalPages: 0,
        isNext: false,
      },
    };
  }
}

export async function deleteStudent(
  studentId: string,
): Promise<ActionResponse<void>> {
  try {
    // Soft delete the student
    const deletedStudent = await db
      .update(users)
      .set({
        isDeleted: true,
        updatedAt: new Date(),
      })
      .where(eq(users.id, studentId))
      .returning();

    if (deletedStudent.length === 0) {
      return {
        success: false,
        error: "Student not found",
      };
    }

    // Revalidate cache
    // revalidatePath("/admin/students");

    return {
      success: true,
    };
  } catch {
    return {
      success: false,
      error: "Failed to delete student",
    };
  }
}
