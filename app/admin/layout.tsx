import React from "react";
import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { AdminSidebar } from "@/components/navigation/admin-sidebar";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  if (!session) redirect(ROUTES.LOGIN);

  if (session.user.role !== "admin") notFound();

  return (
    <>
      <AdminSidebar />
      <SidebarInset className="overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2 border-b shrink-0">
          <SidebarTrigger />
          <h1 className="text-lg font-semibold">Admin Dashboard</h1>
        </div>
        <main className="flex-1 px-6 pb-6 pt-4 overflow-auto">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </SidebarInset>
    </>
  );
};

export default AdminLayout;
