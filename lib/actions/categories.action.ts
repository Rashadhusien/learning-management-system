"use server";

import action from "../handlers/action";
import { CreateCategorySchema, UpdateCategorySchema } from "../validations";
import { db } from "../db";
import { categories } from "../schema";
import { revalidatePath } from "next/cache";
import handleError from "../handlers/error";
import { eq } from "drizzle-orm";
import {
  CreateCategoryParams,
  UpdateCategoryParams,
  Category,
} from "@/types/action.d";

// Create Category
export async function createCategory(
  params: CreateCategoryParams,
): Promise<ActionResponse<Category>> {
  const validationResult = await action({
    params,
    schema: CreateCategorySchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { params: validatedData } = validationResult;

  if (!validatedData) {
    return handleError(new Error("Validation failed")) as ErrorResponse;
  }

  try {
    const newCategory = await db
      .insert(categories)
      .values({
        name: validatedData.name,
        description: validatedData.description,
        icon: validatedData.icon,
      })
      .returning();

    revalidatePath("/admin/categories");

    return {
      success: true,
      data: newCategory[0] as Category,
    };
  } catch (error) {
    console.error("Error creating category:", error);
    return handleError(error) as ErrorResponse;
  }
}

// Get all Categories
export async function getAllCategories(): Promise<ActionResponse<Category[]>> {
  try {
    const allCategories = await db.select().from(categories);
    return {
      success: true,
      data: allCategories as Category[],
    };
  } catch (error) {
    console.error("Error getting categories:", error);
    return handleError(error) as ErrorResponse;
  }
}

// Update Category
export async function updateCategory(
  id: string,
  params: UpdateCategoryParams,
): Promise<ActionResponse<Category>> {
  const validationResult = await action({
    params,
    schema: UpdateCategorySchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { params: validatedData } = validationResult;

  if (!validatedData) {
    return handleError(new Error("Validation failed")) as ErrorResponse;
  }

  try {
    const updatedCategory = await db
      .update(categories)
      .set({
        ...validatedData,
        updatedAt: new Date(),
      })
      .where(eq(categories.id, id))
      .returning();

    if (!updatedCategory[0]) {
      return handleError(new Error("Category not found")) as ErrorResponse;
    }

    revalidatePath("/admin/categories");

    return {
      success: true,
      data: updatedCategory[0] as Category,
    };
  } catch (error) {
    console.error("Error updating category:", error);
    return handleError(error) as ErrorResponse;
  }
}

// Delete Category
export async function deleteCategory(
  id: string,
): Promise<ActionResponse<Category>> {
  try {
    const deletedCategory = await db
      .update(categories)
      .set({
        isDeleted: true,
        updatedAt: new Date(),
      })
      .where(eq(categories.id, id))
      .returning();

    if (!deletedCategory[0]) {
      return handleError(new Error("Category not found")) as ErrorResponse;
    }

    revalidatePath("/admin/categories");

    return {
      success: true,
      data: deletedCategory[0] as Category,
    };
  } catch (error) {
    console.error("Error deleting category:", error);
    return handleError(error) as ErrorResponse;
  }
}
