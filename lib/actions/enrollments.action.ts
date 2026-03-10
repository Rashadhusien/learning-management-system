"use server";

import action from "../handlers/action";
import { db } from "../db";
import { enrollments, courses, users } from "../schema";
import { revalidatePath } from "next/cache";
import handleError from "../handlers/error";
import { ActionResponse } from "@/types/action.d";
import { auth } from "@/auth";
import { eq, and, or, ilike, desc, count } from "drizzle-orm";
import { projectSubmissions } from "../schema";

// ─── Enroll in Course ───────────────────────────────────────────────────────────

export async function enrollInCourse(
  courseId: string,
): Promise<ActionResponse<void>> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      error: "You must be logged in to enroll in a course",
    };
  }

  try {
    // Check if course exists and is published
    const course = await db
      .select({ id: courses.id, isPublished: courses.isPublished })
      .from(courses)
      .where(and(eq(courses.id, courseId), eq(courses.isDeleted, false)))
      .limit(1);

    if (course.length === 0) {
      return {
        success: false,
        error: "Course not found",
      };
    }

    if (!course[0].isPublished) {
      return {
        success: false,
        error: "Course is not available for enrollment",
      };
    }

    // Check if already enrolled
    const existingEnrollment = await db
      .select()
      .from(enrollments)
      .where(
        and(
          eq(enrollments.studentId, session.user.id),
          eq(enrollments.courseId, courseId),
        ),
      )
      .limit(1);

    if (existingEnrollment.length > 0) {
      return {
        success: false,
        error: "You are already enrolled in this course",
      };
    }

    // Create enrollment
    await db.insert(enrollments).values({
      studentId: session.user.id,
      courseId: courseId,
    });

    // Revalidate cache
    revalidatePath("/courses");
    revalidatePath("/profile/courses");
    revalidatePath(`/courses/${courseId}`);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error enrolling in course:", error);
    return handleError(error) as ErrorResponse;
  }
}

// ─── Check if Student is Enrolled ────────────────────────────────────────────────

export async function isStudentEnrolled(
  courseId: string,
): Promise<ActionResponse<boolean>> {
  // Validate UUID format
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(courseId)) {
    return {
      success: false,
      error: "Invalid course ID format",
    };
  }

  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: true,
      data: false,
    };
  }

  try {
    const enrollment = await db
      .select()
      .from(enrollments)
      .where(
        and(
          eq(enrollments.studentId, session.user.id),
          eq(enrollments.courseId, courseId),
        ),
      )
      .limit(1);

    return {
      success: true,
      data: enrollment.length > 0,
    };
  } catch (error) {
    console.error("Error checking enrollment status:", error);
    return {
      success: false,
      error: "Failed to check enrollment status",
    };
  }
}

// ─── Get Students Enrolled in Course ─────────────────────────────────────────────

export async function getCourseEnrollments(
  courseId: string,
  params: { page?: number; pageSize?: number; query?: string } = {},
): Promise<
  ActionResponse<
    Array<{
      student: {
        id: string;
        name: string;
        username: string;
        email: string;
        image?: string;
        totalPoints: number;
      };
      enrolledAt: Date;
      totalProjects: number;
    }>
  >
> {
  // Validate UUID format
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(courseId)) {
    return {
      success: false,
      error: "Invalid course ID format",
    };
  }

  try {
    const { page = 1, pageSize = 10, query = "" } = params;
    const offset = (page - 1) * pageSize;

    // Build base query conditions
    const whereConditions = [eq(enrollments.courseId, courseId)];

    if (query) {
      const searchCondition = or(
        ilike(users.name, `%${query}%`),
        ilike(users.username, `%${query}%`),
        ilike(users.email, `%${query}%`),
      );
      if (searchCondition) whereConditions.push(searchCondition);
    }

    // Get enrollments with student data and project counts
    const enrollmentsData = await db
      .select({
        student: {
          id: users.id,
          name: users.name,
          username: users.username,
          email: users.email,
          image: users.imageCldPubId,
          totalPoints: users.totalPoints,
        },
        enrolledAt: enrollments.enrolledAt,
      })
      .from(enrollments)
      .innerJoin(users, eq(enrollments.studentId, users.id))
      .where(and(...whereConditions))
      .orderBy(desc(enrollments.enrolledAt))
      .limit(pageSize)
      .offset(offset);

    // Get project counts for each student
    const studentsWithProjects = await Promise.all(
      enrollmentsData.map(async (enrollment) => {
        const projectCount = await db
          .select({ count: count() })
          .from(projectSubmissions)
          .where(
            and(
              eq(projectSubmissions.studentId, enrollment.student.id),
              eq(projectSubmissions.status, "approved"),
            ),
          );

        return {
          ...enrollment,
          totalProjects: projectCount[0]?.count || 0,
        };
      }),
    );

    return {
      success: true,
      data: studentsWithProjects,
    };
  } catch (error) {
    console.error("Error getting course enrollments:", error);
    return handleError(error) as ErrorResponse;
  }
}

export async function getStudentEnrollments(): Promise<
  ActionResponse<Array<{ courseId: string; enrolledAt: Date }>>
> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  try {
    const enrollmentsData = await db
      .select({
        courseId: enrollments.courseId,
        enrolledAt: enrollments.enrolledAt,
      })
      .from(enrollments)
      .where(eq(enrollments.studentId, session.user.id));

    return {
      success: true,
      data: enrollmentsData,
    };
  } catch (error) {
    console.error("Error getting student enrollments:", error);
    return handleError(error) as ErrorResponse;
  }
}
