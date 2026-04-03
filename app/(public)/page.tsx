import Hero from "@/components/Hero";
import { getAuthSession } from "@/lib/auth-wrapper";

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await getAuthSession();

  return (
    <main>
      <Hero />
      {session && (
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Signed in as: {session.user?.email} | Role: {session.user?.role}
          </p>
        </div>
      )}
    </main>
  );
}
