import { z } from "zod";

export const LoginSchema = z.object({
  email: z
    .string()
    .email({ message: "Please provide a valid email address." })
    .min(1, { message: "Email is required." }),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." })
    .max(100, { message: "Password cannot exceed 100 characters." })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter.",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password must contain at least one special character.",
    }),
});

export const RegisterSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long." })
    .max(30, { message: "Username cannot exceed 30 characters." })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers, and underscores.",
    }),

  name: z
    .string()
    .min(1, { message: "Name is required." })
    .max(50, { message: "Name cannot exceed 50 characters." })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Name can only contain letters and spaces.",
    }),

  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email({ message: "Please provide a valid email address." }),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." })
    .max(100, { message: "Password cannot exceed 100 characters." })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter.",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password must contain at least one special character.",
    }),
});

export const CreateCategorySchema = z.object({
  name: z
    .string()
    .min(1, { message: "Category name is required." })
    .max(50, { message: "Category name cannot exceed 50 characters." }),
  description: z.string().optional(),
  icon: z.string().optional(),
});

export const UpdateCategorySchema = z.object({
  name: z
    .string()
    .min(1, { message: "Category name is required." })
    .max(50, { message: "Category name cannot exceed 50 characters." })
    .optional(),
  description: z.string().optional(),
  icon: z.string().optional(),
});

export const CreateCourseSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }),
  description: z.string().min(1, { message: "Description is required." }),
  price: z.number().min(1, { message: "Price must be a positive number." }),
  isPublished: z.boolean().default(false),
  bannerUrl: z.string().min(1, { message: "Banner URL is required." }),
  duration: z
    .number()
    .min(1, { message: "Duration must be a positive number." }),
  level: z.string().min(1, { message: "Level is required." }),
  categoryId: z.string().min(1, { message: "Category is required." }),
});

export const CreateProjectSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }),
  description: z.string().optional(),
  imageCldPubId: z.string().min(1, { message: "Banner URL is required." }),
  points: z.number().min(1, { message: "Points must be a positive number." }),
  classId: z.string().min(1, { message: "Class is required." }),
});

export const GetProfileSchema = z.object({
  userId: z.string().min(1, { message: "User Id is Required" }),
});

export const PaginatedSearchParamsSchema = z.object({
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().default(10),
  query: z.string().optional(),
  filter: z.string().optional(),
  sort: z.string().optional(),
});
