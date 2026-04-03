import { ROUTES } from "@/constants/routes";
import { getAuthSession } from "@/lib/auth-wrapper";
import { getProfile } from "@/lib/actions/profile.action";
import { redirect } from "next/navigation";
import React from "react";
import Navbar from "@/components/navigation/navbar";
import ProfileHeader from "@/components/ProfileHeader";
import { SidebarInset } from "@/components/ui/sidebar";
import Footer from "@/components/layout/footer";
import { Analytics } from "@vercel/analytics/next";
const StudentLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getAuthSession();
  if (!session) redirect(ROUTES.LOGIN);

  const { data: userProfile } = await getProfile({ userId: session.user.id });

  return (
    <SidebarInset>
      <div>
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <ProfileHeader userProfile={userProfile!} enableEdit />
          {children}
        </main>
        <Footer />
      </div>
      <Analytics />
    </SidebarInset>
  );
};

export default StudentLayout;
