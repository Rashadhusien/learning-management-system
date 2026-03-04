"use server";
import { eq } from "drizzle-orm";
import { db } from "../db";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { users, accounts } from "../schema";
import { LoginSchema, RegisterSchema } from "../validations";
import bcrypt from "bcryptjs";
import { signIn } from "@/auth";
import { NotFoundError } from "../http-errors";

import { signOut } from "@/auth";
import { ROUTES } from "@/constants/routes";

export const logInWithCredentails = async (
  params: Pick<AuthCredentails, "email" | "password">,
): Promise<ActionResponse> => {
  const validationResult = await action({ params, schema: LoginSchema });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { email, password } = validationResult.params!;

  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.email, email));

  if (!existingUser) {
    throw new NotFoundError("User not found");
  }

  const [existingAccount] = await db
    .select()
    .from(accounts)
    .where(eq(accounts.providerAccountId, email));

  if (!existingAccount) {
    throw new NotFoundError("User account not found");
  }

  const passwordMatch = await bcrypt.compare(
    password,
    existingAccount.password!,
  );

  if (!passwordMatch) {
    throw new Error("Password does not match!");
  }

  await signIn("credentials", { email, password, redirect: false });

  return { success: true };
};

export const registerWithCredentails = async (params: AuthCredentails) => {
  const validationResult = await action({ params, schema: RegisterSchema });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { name, username, email, password } = validationResult.params!;

  try {
    // Check if user already exists by email
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (existingUser) {
      throw new Error("User already exists");
    }

    // Check if username already exists
    const [existingUsername] = await db
      .select()
      .from(users)
      .where(eq(users.username, username));

    if (existingUsername) {
      throw new Error("Username already exists");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user in database (without password)
    const newUser = await db
      .insert(users)
      .values({
        name,
        username,
        email,
        role: "student",
      })
      .returning();

    console.log("New user created:", newUser);

    // Create associated account record for credentials provider
    const newAccount = await db
      .insert(accounts)
      .values({
        userId: newUser[0]!.id,
        type: "credentials",
        provider: "credentials",
        password: hashedPassword,
        providerAccountId: email,
      })
      .returning();

    console.log("New account created:", newAccount);

    await signIn("credentials", { email, password, redirect: false });
    return { success: true };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

export async function signOutAction() {
  await signOut({ redirectTo: ROUTES.LOGIN });
}
