"use server";

import { PaginatedResponse, User, ActionResponse } from "@/types/action";
import action from "../handlers/action";
import { PaginatedSearchParamsSchema } from "../validations";
import { and, asc, desc, eq, ilike, or, getTableColumns } from "drizzle-orm";
import {
  users,
  courses,
  projects,
  projectSubmissions,
  enrollments,
} from "../schema";
import { db } from "../db";
import { revalidatePath } from "next/cache";
import { ROUTES } from "@/constants/routes";

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

export async function toggleStudentActive(
  studentId: string,
): Promise<ActionResponse<void>> {
  try {
    // Get current student to determine new active value
    const currentStudent = await db
      .select({ active: users.active })
      .from(users)
      .where(eq(users.id, studentId))
      .limit(1);

    if (currentStudent.length === 0) {
      return {
        success: false,
        error: "Student not found",
      };
    }

    // Toggle the active status
    const toggledStudent = await db
      .update(users)
      .set({
        active: !currentStudent[0].active,
        updatedAt: new Date(),
      })
      .where(eq(users.id, studentId))
      .returning();

    if (toggledStudent.length === 0) {
      return {
        success: false,
        error: "Student not found",
      };
    }

    // Revalidate cache
    revalidatePath(ROUTES.ADMIN_STUDENTS);
    revalidatePath(ROUTES.PROFILE);

    return {
      success: true,
    };
  } catch {
    return {
      success: false,
      error: "Failed to toggle student active",
    };
  }
}

export async function getStudentById(studentId: string) {
  try {
    const student = await db
      .select({
        // User fields
        ...getTableColumns(users),
      })
      .from(users)
      .where(eq(users.id, studentId))
      .limit(1);

    if (student.length === 0) {
      return {
        success: false,
        error: "Student not found",
      };
    }

    // Get student's courses
    const studentCourses = await db
      .select({
        id: courses.id,
        title: courses.title,
        description: courses.description,
        bannerUrl: courses.bannerUrl,
        price: courses.price,
        level: courses.level,
        duration: courses.duration,

        enrolledAt: enrollments.enrolledAt,
      })
      .from(enrollments)
      .innerJoin(courses, eq(enrollments.courseId, courses.id))
      .where(eq(enrollments.studentId, studentId));

    // Get student's project submissions with project details
    const studentProjects = await db
      .select({
        submission: {
          id: projectSubmissions.id,
          repoLink: projectSubmissions.repoLink,
          demoLink: projectSubmissions.demoLink,
          status: projectSubmissions.status,
          pointsEarned: projectSubmissions.pointsEarned,
          submittedAt: projectSubmissions.submittedAt,
        },
        project: {
          id: projects.id,
          title: projects.title,
          description: projects.description,
          imageCldPubId: projects.imageCldPubId,
          points: projects.points,
        },
      })
      .from(projectSubmissions)
      .innerJoin(projects, eq(projectSubmissions.projectId, projects.id))
      .where(eq(projectSubmissions.studentId, studentId))
      .orderBy(desc(projectSubmissions.submittedAt));

    // Calculate statistics
    //TODO:add this stats to profile
    // const totalSubmissions = studentProjects.length;
    // const approvedSubmissions = studentProjects.filter(
    //   (p) => p.submission.status === "approved",
    // ).length;
    // const pendingSubmissions = studentProjects.filter(
    //   (p) => p.submission.status === "pending",
    // ).length;
    // const rejectedSubmissions = studentProjects.filter(
    //   (p) => p.submission.status === "rejected",
    // ).length;
    // const totalProjectsEarned = studentProjects
    //   .filter((p) => p.submission.status === "approved")
    //   .reduce((sum, p) => sum + (p.submission.pointsEarned || 0), 0);

    return {
      success: true,
      data: {
        ...student[0],
        courses: studentCourses || [],
        projects: studentProjects || [],
        // stats: {
        //   totalSubmissions,
        //   approvedSubmissions,
        //   pendingSubmissions,
        //   rejectedSubmissions,
        //   totalProjectsEarned,
        // },
      },
    };
  } catch (error) {
    console.error("Error fetching student:", error);
    return {
      success: false,
      error: "Failed to fetch student",
    };
  }
}
