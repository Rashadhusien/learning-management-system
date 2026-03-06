"use server";

import {
  Achievement,
  CreateAchievementParams,
  PaginatedResponse,
} from "@/types/action";
import {
  CreateAchievementSchema,
  PaginatedSearchParamsSchema,
} from "../validations";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { db } from "../db";
import { achievements } from "../schema";
import { and, asc, desc, eq, ilike, or, getTableColumns } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { ROUTES } from "@/constants/routes";

export async function createAchievement(
  params: CreateAchievementParams,
): Promise<ActionResponse<Achievement>> {
  try {
    // Validate input parameters
    const validationResult = await action({
      params,
      schema: CreateAchievementSchema,
      authorize: true,
    });

    if (validationResult instanceof Error) {
      return handleError(validationResult) as ErrorResponse;
    }

    if (!validationResult.params) {
      return {
        success: false,
        error: {
          message: "Invalid parameters provided",
        },
      };
    }

    const { title, description, imageCldPubId, requiredPoints } =
      validationResult.params;

    // Check if project with same title already exists
    const existingProject = await db
      .select()
      .from(achievements)
      .where(eq(achievements.title, title))
      .limit(1);

    if (existingProject.length > 0) {
      return {
        success: false,
        error: {
          message: "An achievement with this title already exists",
        },
      };
    }

    // Create the project
    const newAchievement = await db
      .insert(achievements)
      .values({
        title,
        description: description || null,
        imageCldPubId: imageCldPubId,
        requiredPoints: requiredPoints,
      })
      .returning();

    // Revalidate cache
    revalidatePath(ROUTES.ADMIN_ACHIEVEMENTS);
    revalidatePath(ROUTES.ACHIEVEMENTS);

    return {
      success: true,
      data: newAchievement[0],
    };
  } catch (error) {
    console.error("Error creating achievement:", error);
    return handleError(error) as ErrorResponse;
  }
}

export async function getAllAchievements(
  params: PaginatedSearchParams,
): Promise<PaginatedResponse<Achievement>> {
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
    // Build where conditions
    const whereConditions = [];

    // Add search query filter
    if (query) {
      const searchCondition = or(
        ilike(achievements.title, `%${query}%`),
        ilike(achievements.description, `%${query}%`),
      );
      if (searchCondition) {
        whereConditions.push(searchCondition);
      }
    }

    // Build order by clause
    let orderByClause;
    switch (sort) {
      case "title-asc":
        orderByClause = asc(achievements.title);
        break;
      case "title-desc":
        orderByClause = desc(achievements.title);
        break;
      case "points-asc":
        orderByClause = asc(achievements.requiredPoints);
        break;
      case "points-desc":
        orderByClause = desc(achievements.requiredPoints);
        break;
      case "created-desc":
        orderByClause = desc(achievements.createdAt);
        break;
      case "created-asc":
        orderByClause = asc(achievements.createdAt);
        break;
      default:
        orderByClause = desc(achievements.createdAt);
    }

    // Get total count for pagination
    const totalCountResult = await db
      .select({ count: achievements.id })
      .from(achievements)
      .where(and(...whereConditions));

    const total = totalCountResult.length;

    // Get paginated courses
    const allAchievements = await db
      .select({
        ...getTableColumns(achievements),
      })
      .from(achievements)
      .where(and(...whereConditions))
      .orderBy(orderByClause)
      .limit(pageSize)
      .offset(offset);

    const totalPages = Math.ceil(total / pageSize);

    const isNext = total > page * pageSize;

    return {
      success: true,
      data: allAchievements,
      pagination: {
        page,
        pageSize,
        total,
        totalPages,
        isNext,
      },
    };
  } catch (error) {
    console.error("Error getting achievements:", error);
    return {
      success: false,
      error: "Failed to fetch achievements",
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
