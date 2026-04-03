import Footer from "@/components/layout/footer";
import { AppSidebar } from "@/components/navigation/app-sidbar";
import Navbar from "@/components/navigation/navbar";
import { SidebarInset } from "@/components/ui/sidebar";
import React from "react";

const PublicLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <div className="relative">
          <Navbar />
          {children}
          <Footer />
        </div>
      </SidebarInset>
    </>
  );
};

export default PublicLayout;
