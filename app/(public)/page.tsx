import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await auth();
  console.log(session);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 font-sans">
      <h1 className="text-4xl font-bold">Next.js + Neon</h1>
      <div className="text-sm text-gray-600">
        {session ? (
          <div>
            <p>Signed in as: {session.user?.email}</p>
            <p>Role: {session.user?.role}</p>
          </div>
        ) : (
          <p>Not signed in</p>
        )}
      </div>
    </main>
  );
}
