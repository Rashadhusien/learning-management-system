import { ROUTES } from "./routes";

export const sidebarLinks = [
  {
    // imgUrl: "/icons/home.svg",
    route: ROUTES.HOME,
    label: "Home",
  },
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
