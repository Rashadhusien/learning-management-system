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
import { projects, courses } from "../schema";
import { and, asc, desc, eq, ilike, or, getTableColumns } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createProject(
  params: CreateProjectParams,
): Promise<ActionResponse<Project>> {
  try {
    // Validate input parameters
    const validationResult = await action({
      params,
      schema: CreateProjectSchema,
      authorize: true,
    });

    if (validationResult instanceof Error) {
      return handleError(validationResult) as ErrorResponse;
    }

    if (!validationResult.params) {
      return {
        success: false,
        error: "Invalid parameters provided",
      };
    }

    const { title, description, imageCldPubId, points, classId } =
      validationResult.params;

    // Check if project with same title already exists
    const existingProject = await db
      .select()
      .from(projects)
      .where(eq(projects.title, title))
      .limit(1);

    if (existingProject.length > 0) {
      return {
        success: false,
        error: "A project with this title already exists",
      };
    }

    // Create the project
    const newProject = await db
      .insert(projects)
      .values({
        title,
        description: description || null,
        imageCldPubId: imageCldPubId,
        points: points || 50,
        courseId: classId,
      })
      .returning();

    // Revalidate cache
    revalidatePath("/admin/projects");
    revalidatePath("/projects");

    return {
      success: true,
      data: newProject[0],
    };
  } catch (error) {
    console.error("Error creating project:", error);
    return handleError(error) as ErrorResponse;
  }
}

export async function getAllProjects(
  params: PaginatedSearchParams,
): Promise<PaginatedResponse<Project>> {
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
      if (searchCondition) {
        whereConditions.push(searchCondition);
      }
    }

    if (filter) {
      whereConditions.push(eq(projects.courseId, filter));
    }

    let orderByClause;
    switch (sort) {
      case "title-asc":
        orderByClause = asc(projects.title);
        break;
      case "title-desc":
        orderByClause = desc(projects.title);
        break;
      case "created-desc":
        orderByClause = desc(projects.createdAt);
        break;
      case "created-asc":
        orderByClause = asc(projects.createdAt);
        break;
      default:
        orderByClause = desc(projects.createdAt);
    }

    const totalCountResult = await db
      .select({ count: projects.id })
      .from(projects)
      .where(and(...whereConditions));

    const total = totalCountResult.length;

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

    const totalPages = Math.ceil(total / pageSize);

    const isNext = total > page * pageSize;

    return {
      success: true,
      data: allProjects,
      pagination: {
        total,
        page,
        pageSize,
        totalPages,
        isNext,
      },
    };
  } catch (error) {
    console.error("Error fetching projects:", error);
    return handleError(error) as ErrorResponse;
  }
}

// export async function getProjectById(
//   projectId: string,
// ): Promise<ActionResponse<Project>> {
//   try {
//     const project = await db
//       .select()
//       .from(projects)
//       .where(eq(projects.id, projectId))
//       .limit(1);

//     if (project.length === 0) {
//       return {
//         success: false,
//         error: "Project not found",
//       };
//     }

//     return {
//       success: true,
//       data: project[0],
//     };
//   } catch (error) {
//     console.error("Error fetching project:", error);
//     return handleError(error) as ErrorResponse;
//   }
// }

// export async function updateProject(
//   projectId: string,
//   params: Partial<CreateProjectParams>,
// ): Promise<ActionResponse<Project>> {
//   try {
//     // Validate input parameters
//     const validationResult = await action({
//       params: { ...params, id: projectId },
//       schema: CreateProjectSchema.partial(),
//       authorize: true,
//     });

//     if (validationResult instanceof Error) {
//       return handleError(validationResult) as ErrorResponse;
//     }

//     const { title, description, imageCldPubId, points, classId } =
//       validationResult.params;

//     // Check if project exists
//     const existingProject = await db
//       .select()
//       .from(projects)
//       .where(eq(projects.id, projectId))
//       .limit(1);

//     if (existingProject.length === 0) {
//       return {
//         success: false,
//         error: "Project not found",
//       };
//     }

//     // Check if another project has the same title
//     if (title && title !== existingProject[0].title) {
//       const duplicateProject = await db
//         .select()
//         .from(projects)
//         .where(eq(projects.title, title))
//         .limit(1);

//       if (duplicateProject.length > 0) {
//         return {
//           success: false,
//           error: "A project with this title already exists",
//         };
//       }
//     }

//     // Update the project
//     const updatedProject = await db
//       .update(projects)
//       .set({
//         ...(title && { title }),
//         ...(description !== undefined && { description: description || null }),
//         ...(imageCldPubId !== undefined && {
//           imageCldPubId: imageCldPubId || null,
//         }),
//         ...(points !== undefined && { points: points || 50 }),
//         ...(classId && { courseId: classId }),
//         updatedAt: new Date(),
//       })
//       .where(eq(projects.id, projectId))
//       .returning();

//     // Revalidate cache
//     revalidatePath("/admin/projects");
//     revalidatePath("/projects");
//     revalidatePath(`/admin/projects/${projectId}`);

//     return {
//       success: true,
//       data: updatedProject[0],
//     };
//   } catch (error) {
//     console.error("Error updating project:", error);
//     return handleError(error) as ErrorResponse;
//   }
// }

// export async function deleteProject(
//   projectId: string,
// ): Promise<ActionResponse<void>> {
//   try {
//     // Check if project exists
//     const existingProject = await db
//       .select()
//       .from(projects)
//       .where(eq(projects.id, projectId))
//       .limit(1);

//     if (existingProject.length === 0) {
//       return {
//         success: false,
//         error: "Project not found",
//       };
//     }

//     // Soft delete the project
//     await db
//       .update(projects)
//       .set({
//         isDeleted: true,
//         updatedAt: new Date(),
//       })
//       .where(eq(projects.id, projectId));

//     // Revalidate cache
//     revalidatePath("/admin/projects");
//     revalidatePath("/projects");

//     return {
//       success: true,
//     };
//   } catch (error) {
//     console.error("Error deleting project:", error);
//     return handleError(error) as ErrorResponse;
//   }
// }
