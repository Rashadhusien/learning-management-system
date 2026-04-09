"use server";

import { db } from "@/lib/db";
import {
  courseChapters,
  enrollments,
  courses,
  courseLessons,
} from "@/lib/schema";
import { auth } from "@/auth";
import { and, eq, gt, gte, lt, sql, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  CreateChapterInput,
  createChapterSchema,
  CreateLessonInput,
  createLessonSchema,
} from "../validations";
import { ActionResponse, CourseLesson, CourseChapter } from "@/types/action.d";

// ─── Types ────────────────────────────────────────────────────────────────────
export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

// ─── Guards ───────────────────────────────────────────────────────────────────
async function requireAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("Not authenticated");
  if (session.user.role !== "admin")
    throw new Error("Unauthorized: admin only");
  return session;
}

async function requireStudent() {
  const session = await auth();
  if (!session?.user) throw new Error("Not authenticated");
  return session;
}

// ─── Validation Schemas ───────────────────────────────────────────────────────

// ─── CREATE ───────────────────────────────────────────────────────────────────
/**
 * Creates a new chapter at the END of the course (auto-increments order).
 * Only admin can create chapters.
 */

export async function createChapter(
  input: CreateChapterInput,
): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAdmin();

    const validated = createChapterSchema.parse(input);

    // Verify course exists and is not deleted
    const course = await db.query.courses.findFirst({
      where: and(
        eq(courses.id, validated.courseId),
        eq(courses.isDeleted, false),
      ),
      columns: { id: true },
    });

    if (!course) {
      return { success: false, error: "Course not found" };
    }

    // Get the highest current order for this course
    const lastChapter = await db.query.courseChapters.findFirst({
      where: and(
        eq(courseChapters.courseId, validated.courseId),
        eq(courseChapters.isDeleted, false),
      ),
      orderBy: (l, { desc }) => [desc(l.order)],
      columns: { order: true },
    });

    const nextOrder = (lastChapter?.order ?? -1) + 1;

    const [newChapter] = await db
      .insert(courseChapters)
      .values({
        ...validated,
        order: nextOrder,
      })
      .returning({ id: courseChapters.id });

    revalidatePath(`/admin/courses/${validated.courseId}/lectures`);
    revalidatePath(`/admin/courses/${validated.courseId}`);
    revalidatePath(`/courses/${validated.courseId}`);

    return { success: true, data: { id: newChapter.id } };
  } catch (e) {
    if (e instanceof z.ZodError) {
      return { success: false, error: e.issues[0].message };
    }
    console.error("[createChapter]", e);
    return { success: false, error: "Failed to create lecture" };
  }
}

/**
 * Creates a new lesson at the END of the course/chapter (auto-increments order).
 * Only admin can create lessons.
 */
export async function createLesson(
  input: CreateLessonInput,
): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAdmin();

    const validated = createLessonSchema.parse(input);

    // Verify course exists and is not deleted
    const course = await db.query.courses.findFirst({
      where: and(
        eq(courses.id, validated.courseId),
        eq(courses.isDeleted, false),
      ),
      columns: { id: true },
    });

    if (!course) {
      return { success: false, error: "Course not found" };
    }

    // Verify chapter exists and belongs to the course
    const chapter = await db.query.courseChapters.findFirst({
      where: and(
        eq(courseChapters.id, validated.chapterId),
        eq(courseChapters.courseId, validated.courseId),
        eq(courseChapters.isDeleted, false),
      ),
      columns: { id: true },
    });

    if (!chapter) {
      return { success: false, error: "Chapter not found" };
    }

    // Get the highest current order for this chapter
    const lastLesson = await db.query.courseLessons.findFirst({
      where: and(
        eq(courseLessons.chapterId, validated.chapterId),
        eq(courseLessons.isDeleted, false),
      ),
      orderBy: (l, { desc }) => [desc(l.order)],
      columns: { order: true },
    });

    const nextOrder = (lastLesson?.order ?? 0) + 1;

    const [newLesson] = await db
      .insert(courseLessons)
      .values({
        ...validated,
        order: nextOrder,
        videoUrl: validated.videoUrl || null,
        description: validated.description || null,
        content: validated.content || null,
        projectInstructions: validated.projectInstructions || null,
        starterCode: validated.starterCode || null,
        solutionCode: validated.solutionCode || null,
      })
      .returning({ id: courseLessons.id });

    revalidatePath(`/admin/courses/${validated.courseId}`);
    revalidatePath(`/courses/${validated.courseId}`);

    return { success: true, data: { id: newLesson.id } };
  } catch (e) {
    if (e instanceof z.ZodError) {
      return { success: false, error: e.issues[0].message };
    }
    console.error("[createLesson]", e);
    return { success: false, error: "Failed to create lesson" };
  }
}

// ─── GET ───────────────────────────────────────────────────────────────────
/**
 * get course lectures
 *
 */

export async function getCourseLectures(
  courseId: string,
): Promise<ActionResponse<CourseLesson[]>> {
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
    const session = await auth();
    const isAdmin = session?.user?.role === "admin";

    // Verify course exists and is not deleted
    const course = await db.query.courses.findFirst({
      where: and(eq(courses.id, courseId), eq(courses.isDeleted, false)),
      columns: { id: true },
    });

    if (!course) {
      return {
        success: false,
        error: "Course not found",
      };
    }

    // Build where conditions based on user role
    const whereConditions = isAdmin
      ? and(
          eq(courseLessons.courseId, courseId),
          eq(courseLessons.isDeleted, false),
        )
      : and(
          eq(courseLessons.courseId, courseId),
          eq(courseLessons.isDeleted, false),
          eq(courseLessons.isPublished, true),
        );

    // Fetch lessons without relations for now
    const lessons = await db.query.courseLessons.findMany({
      where: whereConditions,
      orderBy: [asc(courseLessons.order)],
    });

    return {
      success: true,
      data: lessons,
    };
  } catch (error) {
    console.error("Error getting course lectures:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch course lectures",
    };
  }
}

// ─── GET ───────────────────────────────────────────────────────────────────
/**
 * get lecture by id
 *
 */
export async function getLectureById(
  lectureId: string,
): Promise<ActionResponse<CourseLesson>> {
  // Validate UUID format
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(lectureId)) {
    return {
      success: false,
      error: "Invalid lecture ID format",
    };
  }

  try {
    const session = await auth();
    const isAdmin = session?.user?.role === "admin";

    // Fetch the lecture without relations for now
    const lecture = await db.query.courseLessons.findFirst({
      where: and(
        eq(courseLessons.id, lectureId),
        isAdmin
          ? eq(courseLessons.isDeleted, false)
          : and(
              eq(courseLessons.isDeleted, false),
              eq(courseLessons.isPublished, true),
            ),
      ),
    });

    if (!lecture) {
      return {
        success: false,
        error: "Lecture not found",
      };
    }

    return {
      success: true,
      data: lecture,
    };
  } catch (error) {
    console.error("Error getting lecture by ID:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      lectureId,
    });
    return {
      success: false,
      error: `Failed to get lecture: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

/**
 * get course chapters with their lessons
 *
 */
export async function getCourseChapters(
  courseId: string,
): Promise<ActionResponse<CourseChapter[]>> {
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
    const session = await auth();
    const isAdmin = session?.user?.role === "admin";

    // Verify course exists and is not deleted
    const course = await db.query.courses.findFirst({
      where: and(eq(courses.id, courseId), eq(courses.isDeleted, false)),
      columns: { id: true },
    });

    if (!course) {
      return {
        success: false,
        error: "Course not found",
      };
    }

    // Fetch chapters first
    const chapters = await db.query.courseChapters.findMany({
      where: and(
        eq(courseChapters.courseId, courseId),
        eq(courseChapters.isDeleted, false),
      ),
      orderBy: [asc(courseChapters.order)],
    });

    // Fetch lessons for each chapter
    const chaptersWithLessons = await Promise.all(
      chapters.map(async (chapter) => {
        const lessons = await db.query.courseLessons.findMany({
          where: and(
            eq(courseLessons.chapterId, chapter.id),
            isAdmin
              ? eq(courseLessons.isDeleted, false)
              : and(
                  eq(courseLessons.isDeleted, false),
                  eq(courseLessons.isPublished, true),
                ),
          ),
          orderBy: [asc(courseLessons.order)],
        });

        return {
          ...chapter,
          lessons,
        };
      }),
    );

    return {
      success: true,
      data: chaptersWithLessons,
    };
  } catch (error) {
    console.error("Error getting course chapters:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch course chapters",
    };
  }
}

// ─── CREATE ───────────────────────────────────────────────────────────────────
/**
 * Creates a new lecture at the END of the course (auto-increments order).
 * Only admin can create lectures.
 */
// export async function createLecture(
//   input: CreateLectureInput,
// ): Promise<ActionResult<{ id: string }>> {
//   try {
//     await requireAdmin();

//     const validated = createLectureSchema.parse(input);

//     // Verify course exists and is not deleted
//     const course = await db.query.courses.findFirst({
//       where: and(
//         eq(courses.id, validated.courseId),
//         eq(courses.isDeleted, false),
//       ),
//       columns: { id: true },
//     });

//     if (!course) {
//       return { success: false, error: "Course not found" };
//     }

//     // Get the highest current order for this course
//     const lastLecture = await db.query.studentLessonProgress.findFirst({
//       where: and(
//         eq(lectures.courseId, validated.courseId),
//         eq(lectures.isDeleted, false),
//       ),
//       orderBy: (l, { desc }) => [desc(l.order)],
//       columns: { order: true },
//     });

//     const nextOrder = (lastLecture?.order ?? -1) + 1;

//     const [newLecture] = await db
//       .insert(lectures)
//       .values({
//         ...validated,
//         videoUrl: validated.videoUrl || null,
//         articleContent: validated.articleContent || null,
//         description: validated.description || null,
//         order: nextOrder,
//       })
//       .returning({ id: lectures.id });

//     revalidatePath(`/admin/courses/${validated.courseId}/lectures`);
//     revalidatePath(`/courses/${validated.courseId}`);

//     return { success: true, data: { id: newLecture.id } };
//   } catch (e) {
//     if (e instanceof z.ZodError) {
//       return { success: false, error: e.errors[0].message };
//     }
//     console.error("[createLecture]", e);
//     return { success: false, error: "Failed to create lecture" };
//   }
// }

// ─── READ: Get all lectures for a course ──────────────────────────────────────
/**
 * Returns all non-deleted lectures for a course, ordered by `order` ASC.
 * For students: only published lectures unless they're enrolled.
 * For admins: all lectures (including drafts).
 */
// export async function getCourseLectures(courseId: string): Promise<
//   ActionResult<{
//     lectures: Array<typeof lectures.$inferSelect>;
//     totalCount: number;
//     publishedCount: number;
//   }>
// > {
//   try {
//     const session = await auth();
//     const isAdmin = session?.user?.role === "admin";

//     const whereConditions = isAdmin
//       ? and(eq(lectures.courseId, courseId), eq(lectures.isDeleted, false))
//       : and(
//           eq(lectures.courseId, courseId),
//           eq(lectures.isDeleted, false),
//           eq(lectures.isPublished, true),
//         );

//     const allLectures = await db.query.lectures.findMany({
//       where: whereConditions,
//       orderBy: (l, { asc }) => [asc(l.order)],
//     });

//     return {
//       success: true,
//       data: {
//         lectures: allLectures,
//         totalCount: allLectures.length,
//         publishedCount: allLectures.filter((l) => l.isPublished).length,
//       },
//     };
//   } catch (e) {
//     console.error("[getCourseLectures]", e);
//     return { success: false, error: "Failed to fetch lectures" };
//   }
// }

// ─── READ: Get single lecture ─────────────────────────────────────────────────
/**
 * Returns a single lecture by ID.
 * Students can only access if: lecture is published AND (lecture is free OR student is enrolled).
 * Admins can access any lecture.
 */
// export async function getLecture(lectureId: string): Promise<
//   ActionResult<{
//     lecture: typeof lectures.$inferSelect;
//     isCompleted: boolean;
//     canAccess: boolean;
//   }>
// > {
//   try {
//     const session = await auth();
//     const isAdmin = session?.user?.role === "admin";

//     const lecture = await db.query.courseLessons.findFirst({
//       where: and(
//         eq(courseLessons.id, lectureId),
//         eq(courseLessons.isDeleted, false),
//       ),
//     });

//     if (!lecture) {
//       return { success: false, error: "Lecture not found" };
//     }

//     // Admin can always access
//     if (isAdmin) {
//       return {
//         success: true,
//         data: { lecture, isCompleted: false, canAccess: true },
//       };
//     }

//     // Check if published
//     if (!lecture.isPublished) {
//       return { success: false, error: "Lecture not available" };
//     }

//     // Free lectures — anyone can access
//     if (lecture.isFree) {
//       let isCompleted = false;
//       if (session?.user?.id) {
//         const progress = await db.query.lessonProgress.findFirst({
//           where: and(
//             eq(lessonProgress.studentId, session.user.id),
//             eq(lessonProgress.lessonId, lectureId),
//           ),
//         });
//         isCompleted = !!progress;
//       }
//       return { success: true, data: { lecture, isCompleted, canAccess: true } };
//     }

//     // Paid lectures — must be enrolled
//     if (!session?.user?.id) {
//       return {
//         success: true,
//         data: { lecture, isCompleted: false, canAccess: false },
//       };
//     }

//     const enrollment = await db.query.enrollments.findFirst({
//       where: and(
//         eq(enrollments.studentId, session.user.id),
//         eq(enrollments.courseId, lecture.courseId),
//       ),
//     });

//     const isCompleted = enrollment
//       ? !!(await db.query.lectureProgress.findFirst({
//           where: and(
//             eq(lectureProgress.studentId, session.user.id),
//             eq(lectureProgress.lectureId, lectureId),
//           ),
//         }))
//       : false;

//     return {
//       success: true,
//       data: {
//         lecture,
//         isCompleted,
//         canAccess: !!enrollment,
//       },
//     };
//   } catch (e) {
//     console.error("[getLecture]", e);
//     return { success: false, error: "Failed to fetch lecture" };
//   }
// }

// ─── UPDATE ───────────────────────────────────────────────────────────────────
/**
 * Updates a lecture's content/metadata.
 * Only admin can update.
 */
// export async function updateLecture(
//   lectureId: string,
//   input: UpdateLectureInput,
// ): Promise<ActionResult<void>> {
//   try {
//     await requireAdmin();

//     const validated = updateLectureSchema.parse(input);

//     const existing = await db.query.lectures.findFirst({
//       where: and(eq(lectures.id, lectureId), eq(lectures.isDeleted, false)),
//       columns: { id: true, courseId: true },
//     });

//     if (!existing) {
//       return { success: false, error: "Lecture not found" };
//     }

//     await db
//       .update(lectures)
//       .set({
//         ...validated,
//         videoUrl: validated.videoUrl === "" ? null : validated.videoUrl,
//         updatedAt: new Date(),
//       })
//       .where(eq(lectures.id, lectureId));

//     revalidatePath(`/admin/courses/${existing.courseId}/lectures`);
//     revalidatePath(`/courses/${existing.courseId}`);
//     revalidatePath(`/courses/${existing.courseId}/lectures/${lectureId}`);

//     return { success: true, data: undefined };
//   } catch (e) {
//     if (e instanceof z.ZodError) {
//       return { success: false, error: e.errors[0].message };
//     }
//     console.error("[updateLecture]", e);
//     return { success: false, error: "Failed to update lecture" };
//   }
// }

// ─── DELETE (soft) ────────────────────────────────────────────────────────────
/**
 * Soft-deletes a lecture and re-orders remaining lectures to fill the gap.
 */
// export async function deleteLecture(
//   lectureId: string,
// ): Promise<ActionResult<void>> {
//   try {
//     await requireAdmin();

//     const lecture = await db.query.lectures.findFirst({
//       where: and(eq(lectures.id, lectureId), eq(lectures.isDeleted, false)),
//       columns: { id: true, courseId: true, order: true },
//     });

//     if (!lecture) {
//       return { success: false, error: "Lecture not found" };
//     }

//     // Soft delete
//     await db
//       .update(lectures)
//       .set({ isDeleted: true, updatedAt: new Date() })
//       .where(eq(lectures.id, lectureId));

//     // Re-order remaining lectures (shift everything after the deleted one down by 1)
//     await db
//       .update(lectures)
//       .set({ order: sql`${lectures.order} - 1` })
//       .where(
//         and(
//           eq(lectures.courseId, lecture.courseId),
//           eq(lectures.isDeleted, false),
//           gt(lectures.order, lecture.order),
//         ),
//       );

//     revalidatePath(`/admin/courses/${lecture.courseId}/lectures`);
//     revalidatePath(`/courses/${lecture.courseId}`);

//     return { success: true, data: undefined };
//   } catch (e) {
//     console.error("[deleteLecture]", e);
//     return { success: false, error: "Failed to delete lecture" };
//   }
// }

// ─── REORDER ──────────────────────────────────────────────────────────────────
/**
 * Moves a lecture UP or DOWN in the order.
 * Swaps the `order` value with the adjacent lecture.
 */
// export async function reorderLecture(
//   lectureId: string,
//   direction: "up" | "down",
// ): Promise<ActionResult<void>> {
//   try {
//     await requireAdmin();

//     const lecture = await db.query.lectures.findFirst({
//       where: and(eq(lectures.id, lectureId), eq(lectures.isDeleted, false)),
//       columns: { id: true, courseId: true, order: true },
//     });

//     if (!lecture) return { success: false, error: "Lecture not found" };

//     const targetOrder =
//       direction === "up" ? lecture.order - 1 : lecture.order + 1;

//     if (targetOrder < 0) return { success: false, error: "Already at the top" };

//     // Find the adjacent lecture to swap with
//     const adjacent = await db.query.lectures.findFirst({
//       where: and(
//         eq(lectures.courseId, lecture.courseId),
//         eq(lectures.order, targetOrder),
//         eq(lectures.isDeleted, false),
//       ),
//       columns: { id: true, order: true },
//     });

//     if (!adjacent) return { success: false, error: "Already at the end" };

//     // Swap orders in a transaction
//     await db.transaction(async (tx) => {
//       await tx
//         .update(lectures)
//         .set({ order: targetOrder, updatedAt: new Date() })
//         .where(eq(lectures.id, lectureId));

//       await tx
//         .update(lectures)
//         .set({ order: lecture.order, updatedAt: new Date() })
//         .where(eq(lectures.id, adjacent.id));
//     });

//     revalidatePath(`/admin/courses/${lecture.courseId}/lectures`);
//     revalidatePath(`/courses/${lecture.courseId}`);

//     return { success: true, data: undefined };
//   } catch (e) {
//     console.error("[reorderLecture]", e);
//     return { success: false, error: "Failed to reorder lecture" };
//   }
// }

// ─── TOGGLE PUBLISH ───────────────────────────────────────────────────────────
// export async function toggleLecturePublish(
//   lectureId: string,
// ): Promise<ActionResult<{ isPublished: boolean }>> {
//   try {
//     await requireAdmin();

//     const lecture = await db.query.lectures.findFirst({
//       where: and(eq(lectures.id, lectureId), eq(lectures.isDeleted, false)),
//       columns: { id: true, isPublished: true, courseId: true },
//     });

//     if (!lecture) return { success: false, error: "Lecture not found" };

//     const newState = !lecture.isPublished;

//     await db
//       .update(lectures)
//       .set({ isPublished: newState, updatedAt: new Date() })
//       .where(eq(lectures.id, lectureId));

//     revalidatePath(`/admin/courses/${lecture.courseId}/lectures`);
//     revalidatePath(`/courses/${lecture.courseId}`);

//     return { success: true, data: { isPublished: newState } };
//   } catch (e) {
//     console.error("[toggleLecturePublish]", e);
//     return { success: false, error: "Failed to toggle publish state" };
//   }
// }

// ─── MARK COMPLETE ────────────────────────────────────────────────────────────
/**
 * Marks a lecture as completed for the current student.
 * Idempotent — calling again does nothing.
 */
// export async function markLectureComplete(
//   lectureId: string,
//   courseId: string,
// ): Promise<ActionResult<void>> {
//   try {
//     const session = await requireStudent();
//     const studentId = session.user.id;

//     // Verify enrollment
//     const enrollment = await db.query.enrollments.findFirst({
//       where: and(
//         eq(enrollments.studentId, studentId),
//         eq(enrollments.courseId, courseId),
//       ),
//     });

//     // Allow if enrolled OR if lecture is free
//     const lecture = await db.query.lectures.findFirst({
//       where: eq(lectures.id, lectureId),
//       columns: { isFree: true, isPublished: true },
//     });

//     if (!lecture?.isPublished) {
//       return { success: false, error: "Lecture not available" };
//     }

//     if (!enrollment && !lecture.isFree) {
//       return { success: false, error: "Not enrolled in this course" };
//     }

//     // Upsert — insert only if not already exists
//     await db
//       .insert(lectureProgress)
//       .values({ studentId, lectureId, courseId })
//       .onConflictDoNothing();

//     revalidatePath(`/courses/${courseId}/lectures/${lectureId}`);
//     revalidatePath(`/courses/${courseId}`);

//     return { success: true, data: undefined };
//   } catch (e) {
//     console.error("[markLectureComplete]", e);
//     return { success: false, error: "Failed to mark lecture as complete" };
//   }
// }

// ─── UNMARK COMPLETE ──────────────────────────────────────────────────────────
// export async function unmarkLectureComplete(
//   lectureId: string,
//   courseId: string,
// ): Promise<ActionResult<void>> {
//   try {
//     const session = await requireStudent();

//     await db
//       .delete(lectureProgress)
//       .where(
//         and(
//           eq(lectureProgress.studentId, session.user.id),
//           eq(lectureProgress.lectureId, lectureId),
//         ),
//       );

//     revalidatePath(`/courses/${courseId}/lectures/${lectureId}`);
//     revalidatePath(`/courses/${courseId}`);

//     return { success: true, data: undefined };
//   } catch (e) {
//     console.error("[unmarkLectureComplete]", e);
//     return { success: false, error: "Failed to unmark lecture" };
//   }
// }

// ─── GET COURSE PROGRESS ──────────────────────────────────────────────────────
/**
 * Returns how many lectures a student has completed in a course.
 * Useful for the progress bar on the course page.
 */
// export async function getCourseProgress(
//   courseId: string,
//   studentId?: string,
// ): Promise<
//   ActionResult<{ completed: number; total: number; percentage: number }>
// > {
//   try {
//     const session = await auth();
//     const uid = studentId ?? session?.user?.id;

//     if (!uid) {
//       return { success: true, data: { completed: 0, total: 0, percentage: 0 } };
//     }

//     const [totalResult, completedResult] = await Promise.all([
//       db.query.lectures.findMany({
//         where: and(
//           eq(lectures.courseId, courseId),
//           eq(lectures.isDeleted, false),
//           eq(lectures.isPublished, true),
//         ),
//         columns: { id: true },
//       }),
//       db.query.lectureProgress.findMany({
//         where: and(
//           eq(lectureProgress.studentId, uid),
//           eq(lectureProgress.courseId, courseId),
//         ),
//         columns: { id: true },
//       }),
//     ]);

//     const total = totalResult.length;
//     const completed = completedResult.length;
//     const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

//     return { success: true, data: { completed, total, percentage } };
//   } catch (e) {
//     console.error("[getCourseProgress]", e);
//     return { success: false, error: "Failed to get progress" };
//   }
// }
