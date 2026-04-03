import { categories, courses, projects, users } from "../schema";
import { db } from "../db";
import { count, desc, eq, getTableColumns } from "drizzle-orm";
import { ProjectWithCourse } from "./projects.action";
import handleError from "../handlers/error";
import { ErrorResponse, User } from "@/types/action";
import { CourseWithCategory } from "./courses.action";

export async function getRecentProjects(): Promise<
  ActionResponse<{ projects: ProjectWithCourse[]; total: number }>
> {
  try {
    // Correct total count using count()
    const [{ total }] = await db.select({ total: count() }).from(projects);

    const allProjects = await db
      .select({
        ...getTableColumns(projects),
        courseTitle: courses.title,
      })
      .from(projects)
      .leftJoin(courses, eq(projects.courseId, courses.id))
      .orderBy(desc(projects.createdAt))
      .limit(4);

    return {
      success: true,
      data: {
        projects: allProjects as ProjectWithCourse[],
        total,
      },
    };
  } catch (error) {
    console.error("Error fetching projects:", error);
    return handleError(error) as ErrorResponse;
  }
}

export async function getRecentCourses(): Promise<
  ActionResponse<{ courses: CourseWithCategory[]; total: number }>
> {
  try {
    // Correct total count using count()
    const [{ total }] = await db.select({ total: count() }).from(courses);

    const allCourses = await db
      .select({
        ...getTableColumns(courses),
        category: { ...getTableColumns(categories) },
      })
      .from(courses)
      .leftJoin(categories, eq(courses.categoryId, categories.id))
      .orderBy(desc(courses.createdAt))
      .limit(3);
    return {
      success: true,
      data: {
        courses: allCourses as CourseWithCategory[],
        total,
      },
    };
  } catch (error) {
    console.error("Error getting courses:", error);
    return handleError(error) as ErrorResponse;
  }
}

export async function getRecentStudents(): Promise<
  ActionResponse<{ students: User[]; total: number }>
> {
  try {
    const allStudents = await db.select({ count: users.id }).from(users);

    const total = allStudents.length;

    const students = await db
      .select({
        ...getTableColumns(users),
      })
      .from(users)
      .orderBy(desc(users.createdAt))
      .limit(3);

    return {
      success: true,
      data: { students, total },
    };
  } catch (error) {
    console.error("Error getting students:", error);
    return handleError(error) as ErrorResponse;
  }
}
