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
