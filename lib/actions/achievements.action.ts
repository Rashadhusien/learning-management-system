"use server";

import { auth } from "@/auth";
import {
  Achievement,
  CreateAchievementParams,
  PaginatedResponse,
  StudentAchievement,
} from "@/types/action";
import {
  CreateAchievementSchema,
  PaginatedSearchParamsSchema,
} from "../validations";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { db } from "../db";
import {
  achievements,
  enrollments,
  projectSubmissions,
  studentAchievements,
  users,
} from "../schema";
import {
  and,
  asc,
  count,
  desc,
  eq,
  ilike,
  or,
  getTableColumns,
  sql,
} from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { ROUTES } from "@/constants/routes";

// ─── Types ────────────────────────────────────────────────────────────────────

export type AchievementWithProgress = Achievement & {
  /** Number of students who have earned this achievement */
  earnedCount: number;
  /** Total number of active students in the platform */
  totalStudents: number;
  /** Percentage of students who earned this (0–100) */
  progressPercent: number;
};

// ─── Create ───────────────────────────────────────────────────────────────────

export async function createAchievement(
  params: CreateAchievementParams,
): Promise<ActionResponse<Achievement>> {
  try {
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
        error: { message: "Invalid parameters provided" },
      };
    }

    const { title, description, imageCldPubId, requiredPoints } =
      validationResult.params;

    const existingAchievement = await db
      .select({ id: achievements.id })
      .from(achievements)
      .where(eq(achievements.title, title))
      .limit(1);

    if (existingAchievement.length > 0) {
      return {
        success: false,
        error: { message: "An achievement with this title already exists" },
      };
    }

    const [newAchievement] = await db
      .insert(achievements)
      .values({
        title,
        description: description || null,
        imageCldPubId,
        requiredPoints,
      })
      .returning();

    revalidatePath(ROUTES.ADMIN_ACHIEVEMENTS);
    revalidatePath(ROUTES.ACHIEVEMENTS);

    return { success: true, data: newAchievement };
  } catch (error) {
    console.error("Error creating achievement:", error);
    return handleError(error) as ErrorResponse;
  }
}

// ─── Get All (with progress) ──────────────────────────────────────────────────

export async function getAllAchievements(
  params: PaginatedSearchParams,
): Promise<PaginatedResponse<AchievementWithProgress>> {
  const validationResult = await action({
    params,
    schema: PaginatedSearchParamsSchema,
  });

  const emptyPagination = {
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
    isNext: false,
  };

  if (validationResult instanceof Error) {
    return {
      success: false,
      error: "Validation failed",
      pagination: emptyPagination,
    };
  }

  const { page = 1, pageSize = 10, query, sort = "created-desc" } = params;
  const offset = (page - 1) * pageSize;

  try {
    // Build search filter
    const searchCondition = query
      ? or(
          ilike(achievements.title, `%${query}%`),
          ilike(achievements.description, `%${query}%`),
        )
      : undefined;

    // Order by clause
    const orderByClause = (() => {
      switch (sort) {
        case "title-asc":
          return asc(achievements.title);
        case "title-desc":
          return desc(achievements.title);
        case "points-asc":
          return asc(achievements.requiredPoints);
        case "points-desc":
          return desc(achievements.requiredPoints);
        case "created-asc":
          return asc(achievements.createdAt);
        case "created-desc":
        default:
          return desc(achievements.createdAt);
      }
    })();

    // ── Total achievements count (for pagination) ──────────────────────────
    const [{ total }] = await db
      .select({ total: count() })
      .from(achievements)
      .where(searchCondition);

    // ── Total active students on the platform ─────────────────────────────
    // Used as the denominator for progress calculations.
    const [{ totalStudents }] = await db
      .select({ totalStudents: count() })
      .from(users)
      .where(and(eq(users.role, "student"), eq(users.isDeleted, false)));

    // ── Achievements with per-achievement earned count ─────────────────────
    // We use a subquery so we get exactly one row per achievement (no fan-out).
    const earnedCountSq = db
      .select({
        achievementId: studentAchievements.achievementId,
        earnedCount: count().as("earned_count"),
      })
      .from(studentAchievements)
      .groupBy(studentAchievements.achievementId)
      .as("earned_counts");

    const rows = await db
      .select({
        ...getTableColumns(achievements),
        earnedCount: sql<number>`coalesce(${earnedCountSq.earnedCount}, 0)`,
      })
      .from(achievements)
      .leftJoin(earnedCountSq, eq(achievements.id, earnedCountSq.achievementId))
      .where(searchCondition)
      .orderBy(orderByClause)
      .limit(pageSize)
      .offset(offset);

    // Attach totalStudents + derived progressPercent to each row
    const data: AchievementWithProgress[] = rows.map((row) => ({
      ...row,
      earnedCount: row.earnedCount,
      totalStudents,
      progressPercent:
        totalStudents > 0
          ? Math.round((row.earnedCount / totalStudents) * 100)
          : 0,
    }));

    return {
      success: true,
      data,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
        isNext: total > page * pageSize,
      },
    };
  } catch (error) {
    console.error("Error getting achievements:", error);
    return {
      success: false,
      error: "Failed to fetch achievements",
      pagination: emptyPagination,
    };
  }
}

// ─── Earn (manual) ────────────────────────────────────────────────────────────

export async function earnAchievement(
  studentId: string,
  achievementId: string,
): Promise<ActionResponse<StudentAchievement>> {
  try {
    const existing = await db
      .select({ id: studentAchievements.id })
      .from(studentAchievements)
      .where(
        and(
          eq(studentAchievements.studentId, studentId),
          eq(studentAchievements.achievementId, achievementId),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      return {
        success: false,
        error: { message: "Achievement already earned" },
      };
    }

    const [earnedAchievement] = await db
      .insert(studentAchievements)
      .values({ studentId, achievementId, earnedAt: new Date() })
      .returning();

    revalidatePath(ROUTES.ACHIEVEMENTS);
    revalidatePath(ROUTES.PROFILE);

    return { success: true, data: earnedAchievement };
  } catch (error) {
    console.error("Error earning achievement:", error);
    return { success: false, error: { message: "Failed to earn achievement" } };
  }
}

// ─── Get Student Achievements ────────────────────────────────────────────────────

export async function getStudentAchievements(
  params: PaginatedSearchParams,
): Promise<PaginatedResponse<StudentAchievement>> {
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
    // Only get achievements that the user has earned
    const whereConditions = [
      eq(studentAchievements.studentId, session.user.id),
    ];

    if (query) {
      const searchCondition = or(
        ilike(achievements.title, `%${query}%`),
        ilike(achievements.description, `%${query}%`),
      );
      if (searchCondition) whereConditions.push(searchCondition);
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
        orderByClause = desc(studentAchievements.earnedAt);
        break;
      case "created-asc":
        orderByClause = asc(studentAchievements.earnedAt);
        break;
      default:
        orderByClause = desc(studentAchievements.earnedAt);
    }

    // Get total count of earned achievements
    const [{ total }] = await db
      .select({ total: count() })
      .from(studentAchievements)
      .innerJoin(
        achievements,
        eq(studentAchievements.achievementId, achievements.id),
      )
      .where(and(...whereConditions));

    const rows = await db
      .select({
        // Student achievement fields
        id: studentAchievements.id,
        studentId: studentAchievements.studentId,
        achievementId: studentAchievements.achievementId,
        earnedAt: studentAchievements.earnedAt,
        // Achievement fields
        achievement: {
          id: achievements.id,
          title: achievements.title,
          description: achievements.description,
          imageCldPubId: achievements.imageCldPubId,
          requiredPoints: achievements.requiredPoints,
        },
      })
      .from(studentAchievements)
      .innerJoin(
        achievements,
        eq(studentAchievements.achievementId, achievements.id),
      )
      .where(and(...whereConditions))
      .orderBy(orderByClause)
      .limit(pageSize)
      .offset(offset);

    // Shape into StudentProject type structure
    const data: StudentAchievement[] = rows.map((row) => ({
      id: row.id,
      studentId: row.studentId,
      achievementId: row.achievementId,
      earnedAt: row.earnedAt,
      achievement: row.achievement,
    }));

    return {
      success: true,
      data,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
        isNext: total > page * pageSize,
      },
    };
  } catch (error) {
    console.error("Error fetching student achievements:", error);
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

// ─── Auto-award on trigger events ────────────────────────────────────────────

type AchievementTrigger = "register" | "first_project" | "first_course";

const TRIGGER_CRITERIA: Record<AchievementTrigger, { title: string }> = {
  register: { title: "Welcome Aboard" },
  first_project: { title: "Created Your First Project" },
  first_course: { title: "Buy One Course" },
};

export async function checkAndAwardAchievements(
  studentId: string,
  actionType: AchievementTrigger,
): Promise<ActionResponse<StudentAchievement[]>> {
  try {
    const criteria = TRIGGER_CRITERIA[actionType];
    if (!criteria) {
      return { success: false, error: { message: "Invalid action type" } };
    }

    const [achievement] = await db
      .select()
      .from(achievements)
      .where(eq(achievements.title, criteria.title))
      .limit(1);

    if (!achievement) {
      return { success: false, error: { message: "Achievement not found" } };
    }

    const existing = await db
      .select({ id: studentAchievements.id })
      .from(studentAchievements)
      .where(
        and(
          eq(studentAchievements.studentId, studentId),
          eq(studentAchievements.achievementId, achievement.id),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      // Already earned — not an error, just a no-op
      return { success: true, data: [] };
    }

    const [newAchievement] = await db
      .insert(studentAchievements)
      .values({
        studentId,
        achievementId: achievement.id,
        earnedAt: new Date(),
      })
      .returning();

    revalidatePath(ROUTES.ACHIEVEMENTS);
    revalidatePath(ROUTES.PROFILE);

    return { success: true, data: [newAchievement] };
  } catch (error) {
    console.error("Error checking achievements:", error);
    return {
      success: false,
      error: { message: "Failed to check achievements" },
    };
  }
}

export type LeaderboardStudent = {
  id: string;
  name: string;
  username: string;
  imageCldPubId: string | null;
  totalPoints: number;
  totalProjects: number;
  totalCourses: number;
  rank: number;
};
export type LeaderboardResponse =
  | { success: true; data: LeaderboardStudent[] }
  | { success: false; error: string };

export async function getLeaderboard(): Promise<LeaderboardResponse> {
  try {
    // Subquery: count approved project submissions per student
    const projectCountSq = db
      .select({
        studentId: projectSubmissions.studentId,
        totalProjects: count().as("total_projects"),
      })
      .from(projectSubmissions)
      .where(eq(projectSubmissions.status, "approved"))
      .groupBy(projectSubmissions.studentId)
      .as("project_counts");

    // Subquery: count course enrollments per student
    const courseCountSq = db
      .select({
        studentId: enrollments.studentId,
        totalCourses: count().as("total_courses"),
      })
      .from(enrollments)
      .groupBy(enrollments.studentId)
      .as("course_counts");

    const rows = await db
      .select({
        id: users.id,
        name: users.name,
        username: users.username,
        imageCldPubId: users.imageCldPubId,
        totalPoints: users.totalPoints,
        totalProjects: sql<number>`coalesce(${projectCountSq.totalProjects}, 0)`,
        totalCourses: sql<number>`coalesce(${courseCountSq.totalCourses}, 0)`,
      })
      .from(users)
      .leftJoin(projectCountSq, eq(users.id, projectCountSq.studentId))
      .leftJoin(courseCountSq, eq(users.id, courseCountSq.studentId))
      .where(
        and(
          eq(users.role, "student"),
          eq(users.isDeleted, false),
          eq(users.active, true),
        ),
      )
      .orderBy(desc(users.totalPoints));

    const data: LeaderboardStudent[] = rows.map((row, index) => ({
      ...row,
      rank: index + 1,
    }));

    return { success: true, data };
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return { success: false, error: "Failed to fetch leaderboard" };
  }
}
