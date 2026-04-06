export interface SignInWithOAuthParams {
  provider: "github" | "google";
  providerAccountId: string;
  user: {
    email: string;
    name: string;
    image: string;
    username: string;
  };
}

export interface ActionResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T = unknown> extends ActionResponse<T[]> {
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    isNext: boolean;
  };
}

export interface ErrorResponse {
  success: false;
  error: {
    message: string;
    details?: Record<string, string[]>;
  };
}

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string;
  bio?: string | null;
  phone?: string | null;
  level: string;
  totalPoints: number;
  coverCldPubId?: string | null;
  imageCldPubId?: string | null;
  image?: string;
  active: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  emailVerified?: Date | null;
}

export interface AuthCredentails {
  name: string;
  username: string;
  email: string;
  password: string;
}

export interface CreateCourseParams {
  title: string;
  description: string;
  price: number;
  duration: number;
  level: string;
  categoryId: string;
  bannerUrl: string;
  bannerCldPubId?: string;
  isPublished: boolean;
}

// types/action.d.ts

export interface CourseChapter {
  id: string;
  courseId: string;
  title: string;
  description?: string | null;
  order: number;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  // ✅ Populated when fetching chapter with its lessons
  lessons?: CourseLesson[];
}

export interface CourseLesson {
  id: string;
  courseId: string;
  // ✅ Direct FK instead of junction table
  chapterId?: string | null;
  title: string;
  description?: string | null;
  content?: string | null;
  videoUrl?: string | null;
  // ✅ duration in SECONDS
  duration: number;
  lessonType: "video" | "text" | "project" | "quiz" | "assignment";
  order: number;
  isPublished: boolean;
  isRequired: boolean;
  projectInstructions?: string | null;
  starterCode?: string | null;
  solutionCode?: string | null;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  // ✅ Populated relation — used by LessonPlayer sidebar grouping
  chapter?: Pick<CourseChapter, "id" | "title" | "order"> | null;
  resources?: LessonResource[];
}

export interface LessonResource {
  id: string;
  lessonId: string;
  title: string;
  description?: string | null;
  resourceType: "file" | "link" | "video" | "image" | "code";
  fileUrl?: string | null;
  fileName?: string | null;
  fileSize?: number | null;
  cloudinaryPublicId?: string | null;
  url?: string | null;
  code?: string | null;
  language?: string | null;
  order: number;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface StudentLessonProgress {
  id: string;
  studentId: string;
  lessonId: string;
  status: "not_started" | "in_progress" | "completed";
  progressPercent: number;
  // ✅ timeSpent in SECONDS
  timeSpent: number;
  projectSubmitted: boolean;
  projectSubmissionId?: string | null;
  startedAt?: Date | null;
  completedAt?: Date | null;
  lastAccessedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  lesson?: CourseLesson;
  projectSubmission?: ProjectSubmission;
}

export interface StudentCourseProgress {
  studentId: string;
  courseId: string;
  totalLessons: number;
  completedLessons: number;
  progressPercent: number;
  // ✅ totalTimeSpent in SECONDS
  totalTimeSpent: number;
  lastAccessedAt: Date;
  videoLessonsCompleted: number;
  projectLessonsCompleted: number;
  quizLessonsCompleted: number;
  textLessonsCompleted: number;
}

export interface CourseWithLessons extends Course {
  lessons?: CourseLesson[];
  chapters?: CourseChapter[];
  totalLessons?: number;
  completedLessons?: number;
  // ✅ estimatedDuration in SECONDS (sum of lesson durations)
  estimatedDuration?: number;
}

export interface StudentCourseWithProgress extends CourseWithLessons {
  enrolledAt: Date;
  progress?: StudentCourseProgress;
  lessonsProgress?: StudentLessonProgress[];
}

// ── Params (unchanged shape, notes added) ────────────────────────────

export interface CreateLessonParams {
  courseId: string;
  chapterId?: string; // ✅ direct FK, not via junction
  title: string;
  description?: string;
  content?: string;
  videoUrl?: string;
  duration: number; // in seconds
  lessonType: "video" | "text" | "project" | "quiz" | "assignment";
  order: number;
  isPublished?: boolean;
  isRequired?: boolean;
  projectInstructions?: string;
  starterCode?: string;
  solutionCode?: string;
}

export interface UpdateLessonParams {
  chapterId?: string | null;
  title?: string;
  description?: string;
  content?: string;
  videoUrl?: string;
  duration?: number; // in seconds
  lessonType?: "video" | "text" | "project" | "quiz" | "assignment";
  order?: number;
  isPublished?: boolean;
  isRequired?: boolean;
  projectInstructions?: string;
  starterCode?: string;
  solutionCode?: string;
}

export interface CreateChapterParams {
  courseId: string;
  title: string;
  description?: string;
  order: number;
}

export interface CreateResourceParams {
  lessonId: string;
  title: string;
  description?: string;
  resourceType: "file" | "link" | "video" | "image" | "code";
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  cloudinaryPublicId?: string;
  url?: string;
  code?: string;
  language?: string;
  order?: number;
}

export interface LessonProgressUpdateParams {
  lessonProgressId: string;
  progressPercent?: number;
  timeSpent?: number; // additional seconds in this session
  status?: "not_started" | "in_progress" | "completed";
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCategoryParams {
  name: string;
  description?: string;
  icon?: string;
}

export interface UpdateCategoryParams {
  name?: string;
  description?: string;
  icon?: string;
}

export interface CreateProjectParams {
  title: string;
  description?: string;
  imageCldPubId: string;
  points: number;
  classId: string;
}
export interface CreateAchievementParams {
  title: string;
  description?: string;
  imageCldPubId: string;
  requiredPoints: number;
}

export type Achievement = {
  id: string;
  title: string;
  description?: string | null;
  imageCldPubId: string;
  requiredPoints: number | null;
  progressPercent?: number | null;
  totalStudents?: number | null;
  earnedCount?: number | null;
};

export type StudentAchievement = {
  id: string;
  studentId: string;
  achievementId: string;
  earnedAt: Date;
  achievement?: Achievement; // Populated when joining with achievements
};

export type Project = {
  id: string;
  title: string;
  description?: string | null;
  courseId: string;
  imageCldPubId: string;
  points: number | null;
  courseTitle?: string | null;
};

export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  isPublished: boolean;
  bannerUrl: string;
  duration: number;
  level: string;
  categoryId: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  instructorId: string;
  category?: {
    id: string;
    name: string;
    description?: string;
    icon?: string;
  };
}

export interface SubmitProjectParams {
  courseId: string;
  projectId: string;
  repoLink?: string;
  demoLink?: string;
}

export interface ProjectSubmissionParams {
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
  project: {
    id: string;
    title: string;
    imageCldPubId: string | null;
    points: number;
  };
  totalProjects: number;
}
