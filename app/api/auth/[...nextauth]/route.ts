import { handlers } from "@/auth";
export const runtime = "nodejs";

export const { GET, POST } = handlers;

// const session = await auth()

// if (!session) {
//   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
// }

// if (session.user.role !== "admin") {
//   return NextResponse.json({ error: "Forbidden" }, { status: 403 })
// }
