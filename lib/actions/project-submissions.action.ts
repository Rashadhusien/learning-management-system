"use server";

import action from "../handlers/action";
import { db } from "../db";
import { projectSubmissions, projects, users } from "../schema";
import { revalidatePath } from "next/cache";
import handleError from "../handlers/error";
import { ActionResponse } from "@/types/action.d";
import { auth } from "@/auth";
import { eq, and, or, ilike, desc, count } from "drizzle-orm";

// ─── Get Project Submissions ─────────────────────────────────────────────────────

export async function getProjectSubmissions(
  projectId: string,
  params: { page?: number; pageSize?: number; query?: string } = {},
): Promise<ActionResponse<Array<{
  student: {
    id: string;
    name: string;
    username: string;
    email: string;
    image?: string;
    totalPoints: number;
  };
  submission: {
    id: string;
    repoLink: string | null;
    demoLink: string | null;
    status: "pending" | "approved" | "rejected";
    pointsEarned: number | null;
    submittedAt: Date;
  };
  totalProjects: number;
}>>> {
  // Validate UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(projectId)) {
    return {
      success: false,
      error: "Invalid project ID format",
    };
  }

  try {
    const { page = 1, pageSize = 10, query = "" } = params;
    const offset = (page - 1) * pageSize;

    // Build base query conditions for approved submissions only
    const whereConditions = [
      eq(projectSubmissions.projectId, projectId),
      eq(projectSubmissions.status, "approved"),
    ];

    if (query) {
      const searchCondition = or(
        ilike(users.name, `%${query}%`),
        ilike(users.username, `%${query}%`),
        ilike(users.email, `%${query}%`),
      );
      if (searchCondition) whereConditions.push(searchCondition);
    }

    // Get submissions with student data
    const submissionsData = await db
      .select({
        student: {
          id: users.id,
          name: users.name,
          username: users.username,
          email: users.email,
          image: users.imageCldPubId,
          totalPoints: users.totalPoints,
        },
        submission: {
          id: projectSubmissions.id,
          repoLink: projectSubmissions.repoLink,
          demoLink: projectSubmissions.demoLink,
          status: projectSubmissions.status,
          pointsEarned: projectSubmissions.pointsEarned,
          submittedAt: projectSubmissions.submittedAt,
        },
      })
      .from(projectSubmissions)
      .innerJoin(users, eq(projectSubmissions.studentId, users.id))
      .where(and(...whereConditions))
      .orderBy(desc(projectSubmissions.submittedAt))
      .limit(pageSize)
      .offset(offset);

    // Get total project counts for each student
    const studentsWithProjectCounts = await Promise.all(
      submissionsData.map(async (data) => {
        const projectCount = await db
          .select({ count: count() })
          .from(projectSubmissions)
          .where(
            and(
              eq(projectSubmissions.studentId, data.student.id),
              eq(projectSubmissions.status, "approved"),
            ),
          );

        return {
          ...data,
          totalProjects: projectCount[0]?.count || 0,
        };
      }),
    );

    return {
      success: true,
      data: studentsWithProjectCounts,
    };
  } catch (error) {
    console.error("Error getting project submissions:", error);
    return handleError(error) as ErrorResponse;
  }
}

// ─── Get Student Project Submissions ─────────────────────────────────────────────

export async function getStudentProjectSubmissions(): Promise<
  ActionResponse<Array<{ projectId: string; submittedAt: Date }>>
> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  try {
    const submissionsData = await db
      .select({
        projectId: projectSubmissions.projectId,
        submittedAt: projectSubmissions.submittedAt,
      })
      .from(projectSubmissions)
      .where(eq(projectSubmissions.studentId, session.user.id));

    return {
      success: true,
      data: submissionsData,
    };
  } catch (error) {
    console.error("Error getting student project submissions:", error);
    return handleError(error) as ErrorResponse;
  }
}
