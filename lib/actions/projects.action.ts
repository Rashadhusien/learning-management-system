"use server";

import {
  ActionResponse,
  CreateProjectParams,
  PaginatedResponse,
  Project,
} from "@/types/action";
import action from "../handlers/action";
import {
  CreateProjectSchema,
  PaginatedSearchParamsSchema,
} from "../validations";
import handleError from "../handlers/error";
import { db } from "../db";
import { projects, courses, projectSubmissions } from "../schema";
import {
  and,
  asc,
  count,
  desc,
  eq,
  ilike,
  or,
  getTableColumns,
} from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ProjectWithCourse = Project & {
  courseTitle: string | null;
};

export type StudentProject = ProjectWithCourse & {
  submission: {
    id: string;
    repoLink: string | null;
    demoLink: string | null;
    status: "pending" | "approved" | "rejected";
    pointsEarned: number | null;
    submittedAt: Date;
  } | null;
};

// ─── Create ───────────────────────────────────────────────────────────────────

export async function createProject(
  params: CreateProjectParams,
): Promise<ActionResponse<Project>> {
  try {
    const validationResult = await action({
      params,
      schema: CreateProjectSchema,
      authorize: true,
    });

    if (validationResult instanceof Error) {
      return handleError(validationResult) as ErrorResponse;
    }

    if (!validationResult.params) {
      return { success: false, error: "Invalid parameters provided" };
    }

    const { title, description, imageCldPubId, points, classId } =
      validationResult.params;

    const existing = await db
      .select({ id: projects.id })
      .from(projects)
      .where(eq(projects.title, title))
      .limit(1);

    if (existing.length > 0) {
      return {
        success: false,
        error: "A project with this title already exists",
      };
    }

    const [newProject] = await db
      .insert(projects)
      .values({
        title,
        description: description || null,
        imageCldPubId,
        points: points || 50,
        courseId: classId,
      })
      .returning();

    revalidatePath("/admin/projects");
    revalidatePath("/projects");

    return { success: true, data: newProject };
  } catch (error) {
    console.error("Error creating project:", error);
    return handleError(error) as ErrorResponse;
  }
}

// ─── Get All (admin) ──────────────────────────────────────────────────────────

export async function getAllProjects(
  params: PaginatedSearchParams,
): Promise<PaginatedResponse<ProjectWithCourse>> {
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
    const whereConditions = [eq(projects.isDeleted, false)];

    if (query) {
      const searchCondition = or(
        ilike(projects.title, `%${query}%`),
        ilike(projects.description, `%${query}%`),
      );
      if (searchCondition) whereConditions.push(searchCondition);
    }

    if (filter) whereConditions.push(eq(projects.courseId, filter));

    const orderByClause = buildProjectOrderBy(sort);

    // Correct total count using count()
    const [{ total }] = await db
      .select({ total: count() })
      .from(projects)
      .where(and(...whereConditions));

    const allProjects = await db
      .select({
        ...getTableColumns(projects),
        courseTitle: courses.title,
      })
      .from(projects)
      .leftJoin(courses, eq(projects.courseId, courses.id))
      .where(and(...whereConditions))
      .orderBy(orderByClause)
      .limit(pageSize)
      .offset(offset);

    return {
      success: true,
      data: allProjects as ProjectWithCourse[],
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
        isNext: total > page * pageSize,
      },
    };
  } catch (error) {
    console.error("Error fetching projects:", error);
    return handleError(error) as ErrorResponse;
  }
}

// ─── Get Current Student's Projects (with submission status) ─────────────────
// Returns all projects belonging to courses the student is enrolled in,
// each annotated with the student's own submission if it exists.

export async function getStudentProjects(
  params: PaginatedSearchParams,
): Promise<PaginatedResponse<StudentProject>> {
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
    // Only get projects that the user has submitted
    const whereConditions = [
      eq(projectSubmissions.studentId, session.user.id),
      eq(projects.isDeleted, false),
    ];

    if (query) {
      const searchCondition = or(
        ilike(projects.title, `%${query}%`),
        ilike(projects.description, `%${query}%`),
      );
      if (searchCondition) whereConditions.push(searchCondition);
    }

    // filter = courseId
    if (filter) whereConditions.push(eq(projects.courseId, filter));

    const orderByClause = buildProjectOrderBy(sort);

    // Get total count of submitted projects
    const [{ total }] = await db
      .select({ total: count() })
      .from(projectSubmissions)
      .innerJoin(projects, eq(projectSubmissions.projectId, projects.id))
      .where(and(...whereConditions));

    const rows = await db
      .select({
        ...getTableColumns(projects),
        courseTitle: courses.title,
        // submission fields (always present since we're joining submissions)
        submissionId: projectSubmissions.id,
        repoLink: projectSubmissions.repoLink,
        demoLink: projectSubmissions.demoLink,
        submissionStatus: projectSubmissions.status,
        pointsEarned: projectSubmissions.pointsEarned,
        submittedAt: projectSubmissions.submittedAt,
      })
      .from(projectSubmissions)
      .innerJoin(projects, eq(projectSubmissions.projectId, projects.id))
      .leftJoin(courses, eq(projects.courseId, courses.id))
      .where(and(...whereConditions))
      .orderBy(orderByClause)
      .limit(pageSize)
      .offset(offset);

    // Shape into StudentProject
    const data: StudentProject[] = rows.map((row) => {
      const {
        submissionId,
        repoLink,
        demoLink,
        submissionStatus,
        pointsEarned,
        submittedAt,
        courseTitle,
        ...projectFields
      } = row;

      return {
        ...projectFields,
        courseTitle,
        submission: {
          id: submissionId,
          repoLink,
          demoLink,
          status: submissionStatus!,
          pointsEarned,
          submittedAt: submittedAt!,
        },
      };
    });

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
    console.error("Error fetching student projects:", error);
    return handleError(error) as ErrorResponse;
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildProjectOrderBy(sort: string) {
  switch (sort) {
    case "title-asc":
      return asc(projects.title);
    case "title-desc":
      return desc(projects.title);
    case "created-asc":
      return asc(projects.createdAt);
    case "created-desc":
    default:
      return desc(projects.createdAt);
  }
}
