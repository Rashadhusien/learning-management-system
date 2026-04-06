"use server";

import { getAllCourses } from "@/lib/actions/courses.action";
import { getAllProjects } from "@/lib/actions/projects.action";
import { getAllStudents } from "@/lib/actions/students.action";
import { getAllAchievements } from "@/lib/actions/achievements.action";

export interface DashboardStats {
  totalStudents: number;
  totalCourses: number;
  totalProjects: number;
  totalAchievements: number;
  recentEnrollments: number;
  completionRate: number;
}

export interface RecentActivity {
  id: string;
  type: "enrollment" | "submission" | "achievement";
  user: string;
  action: string;
  timestamp: string;
}

export interface TopCourse {
  id: string;
  title: string;
  enrollments: number;
  completionRate: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const [courses, projects, students, achievements] = await Promise.all([
      getAllCourses({ page: 1, pageSize: 1 }),
      getAllProjects({ page: 1, pageSize: 1 }),
      getAllStudents({ page: 1, pageSize: 1 }),
      getAllAchievements({ page: 1, pageSize: 1 }),
    ]);

    return {
      totalStudents: students.pagination?.total || 0,
      totalCourses: courses.pagination?.total || 0,
      totalProjects: projects.pagination?.total || 0,
      totalAchievements: achievements.pagination?.total || 0,
      recentEnrollments: Math.floor(Math.random() * 50) + 10, // Mock data
      completionRate: Math.floor(Math.random() * 30) + 65, // Mock data
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
      totalStudents: 0,
      totalCourses: 0,
      totalProjects: 0,
      totalAchievements: 0,
      recentEnrollments: 0,
      completionRate: 0,
    };
  }
}

export async function getTopCourses(): Promise<TopCourse[]> {
  try {
    const result = await getAllCourses({ page: 1, pageSize: 5 });
    
    if (!result.success || !result.data) {
      return [];
    }

    return result.data.map((course) => ({
      id: course.id,
      title: course.title,
      enrollments: Math.floor(Math.random() * 100) + 20, // Mock enrollment data
      completionRate: Math.floor(Math.random() * 30) + 65, // Mock completion rate
    }));
  } catch (error) {
    console.error("Error fetching top courses:", error);
    return [];
  }
}

export async function getRecentActivities(): Promise<RecentActivity[]> {
  // Mock recent activities data
  return [
    {
      id: "1",
      type: "enrollment",
      user: "John Doe",
      action: "enrolled in React Fundamentals",
      timestamp: "2 minutes ago",
    },
    {
      id: "2",
      type: "submission",
      user: "Jane Smith",
      action: "submitted JavaScript Project",
      timestamp: "5 minutes ago",
    },
    {
      id: "3",
      type: "achievement",
      user: "Mike Johnson",
      action: "earned Fast Learner badge",
      timestamp: "10 minutes ago",
    },
    {
      id: "4",
      type: "enrollment",
      user: "Sarah Wilson",
      action: "enrolled in Python Basics",
      timestamp: "15 minutes ago",
    },
    {
      id: "5",
      type: "submission",
      user: "Tom Brown",
      action: "submitted CSS Project",
      timestamp: "20 minutes ago",
    },
  ];
}
