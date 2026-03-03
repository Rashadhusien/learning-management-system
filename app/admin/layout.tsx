import React from "react";
import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { ROUTES } from "@/constants/routes";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  if (!session) redirect(ROUTES.LOGIN);

  if (session.user.role !== "admin") notFound();

  return (
    <div>
      <header>Admin Header</header>
      {children}
      <footer>Admin Footer</footer>
    </div>
  );
};

export default AdminLayout;
