import { ROUTES } from "@/constants/routes";
import { auth } from "@/auth";
import { getProfile } from "@/lib/actions/profile.action";
import { redirect } from "next/navigation";
import React from "react";
import Navbar from "@/components/navigation/navbar";
import ProfileHeader from "@/components/ProfileHeader";

const StudentLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();
  if (!session) redirect(ROUTES.LOGIN);

  const { data: userProfile } = await getProfile({ userId: session.user.id });

  return (
    <div>
      {/* <Navbar /> */}
      <main className="container mx-auto px-4 py-8">
        <ProfileHeader userProfile={userProfile!} />
        {children}
      </main>
    </div>
  );
};

export default StudentLayout;
