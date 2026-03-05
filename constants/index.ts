import { ROUTES } from "./routes";

export const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB in bytes
export const ALLOWED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
];

const getEnvVar = (key: string): string | undefined => {
  const value = process.env[key];
  return value || undefined;
};

export const CLOUDINARY_CLOUD_NAME = getEnvVar(
  "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME",
);
export const CLOUDINARY_UPLOAD_PRESET = getEnvVar(
  "NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET",
);

export const sidebarLinks = [
  {
    route: ROUTES.COURSES,
    label: "Courses",
  },
  {
    route: ROUTES.PROJECTS,
    label: "Projects",
  },
  {
    route: ROUTES.STUDENTS,
    label: "Students",
  },
  {
    route: ROUTES.LEADERBOARD,
    label: "Leaderboard",
  },
  {
    route: ROUTES.ACHIEVEMENTS,
    label: "Achievements",
  },
];

export const adminLinks = [
  {
    imgUrl: "/icons/home.svg",
    route: ROUTES.ADMIN,
    label: "Dashboard",
  },
  {
    imgUrl: "/icons/category.svg",
    route: ROUTES.ADMIN_CATEGORIES,
    label: "Categories",
  },
  {
    imgUrl: "/icons/courses.svg",
    route: ROUTES.ADMIN_COURSES,
    label: "Courses",
  },
  {
    imgUrl: "/icons/projects.svg",
    route: ROUTES.ADMIN_PROJECTS,
    label: "Projects",
  },
  {
    imgUrl: "/icons/students.svg",
    route: ROUTES.ADMIN_STUDENTS,
    label: "Students",
  },
  {
    imgUrl: "/icons/leaderboard.svg",
    route: ROUTES.ADMIN_LEADERBOARD,
    label: "Leaderboard",
  },
  {
    imgUrl: "/icons/achievements.svg",
    route: ROUTES.ADMIN_ACHIEVEMENTS,
    label: "Achievements",
  },
];
