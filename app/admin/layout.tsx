import React from "react";
import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import LeftSidebar from "@/components/navigation/LeftSidebar";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  if (!session) redirect(ROUTES.LOGIN);

  if (session.user.role !== "admin") notFound();

  return (
    <div>
      <div className="flex">
        <LeftSidebar />
        <section className="flex min-h-screen flex-1 flex-col px-6 pb-6 pt-36 max-md:pb-14 sm:px-14">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </section>
      </div>
    </div>
  );
};

export default AdminLayout;
