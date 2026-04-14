import React from "react";
import { getAuthSession } from "@/lib/auth-wrapper";
import { redirect, notFound } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { AdminSidebar } from "@/components/navigation/admin-sidebar";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Bell, Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { UserDropdown } from "@/components/UserDropdwon";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getAuthSession();

  if (!session) redirect(ROUTES.LOGIN);

  if (session.user.role !== "admin") notFound();

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset className="overflow-hidden">
          {/* Header */}
          <header className="flex items-center justify-between gap-4 px-6 py-1 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shrink-0">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="hover:bg-muted" />
              <div className="hidden md:block">
                <h1 className="text-lg font-semibold text-foreground">
                  Admin Dashboard
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>

              {/* User Menu */}
              <div className="hidden md:block">
                <UserDropdown />
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 px-6 pb-6 pt-4 overflow-auto">
            <div className="mx-auto w-full max-w-7xl space-y-6">{children}</div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
};

export default AdminLayout;
