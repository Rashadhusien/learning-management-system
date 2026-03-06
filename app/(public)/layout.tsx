import Navbar from "@/components/navigation/navbar";
import React from "react";

const PublicLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative">
      <Navbar />

      {children}
      {/* <footer>Footer</footer> */}
    </div>
  );
};

export default PublicLayout;
