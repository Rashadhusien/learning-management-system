import { AppSidebar } from "@/components/navigation/app-sidbar";
import Navbar from "@/components/navigation/navbar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import React from "react";

const PublicLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="relative">
          <Navbar />
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default PublicLayout;
