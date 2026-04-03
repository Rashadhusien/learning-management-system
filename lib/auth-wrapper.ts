import { auth } from "@/auth";

export async function getAuthSession() {
  try {
    return await auth();
  } catch (error) {
    console.error("Auth session error:", error);
    return null;
  }
}
