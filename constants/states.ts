import { ROUTES } from "./routes";

export const DEFAULT_EMPTY = {
  title: "No Data Found",
  message:
    "Looks like the database is taking a nap. Wake it up with some new entries.",
  button: {
    text: "Add Data",
    href: ROUTES.HOME,
  },
};

export const DEFAULT_ERROR = {
  title: "Something Went Wrong",
  message: "Even our code can have a bad day. Give it another shot.",
  button: {
    text: "Retry Request",
    href: ROUTES.HOME,
  },
};

export const EMYPTY_CATEGORY = {
  title: "No categories found",
  message: "Add your first category to get started",
  button: {
    text: "Add Category",
    href: ROUTES.ADMIN_CREATE_CATEGORY,
  },
};

export const EMYPTY_COURSE = {
  title: "No courses found",
  message: "try searching for something else",
  button: {
    text: "Add Course",
    href: ROUTES.ADMIN_CREATE_COURSE,
  },
};

export const EMPTY_PROJECT = {
  title: "No projects found",
  message: "try searching for something else",
};

export const EMPTY_STUDENT = {
  title: "No students found",
  message: "try searching for something else",
};

export const EMPTY_ACHIEVEMENT = {
  title: "No achievements found",
  message: "Create your first achievement to get started",
};
