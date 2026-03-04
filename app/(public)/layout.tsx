import Navbar from "@/components/navigation/navbar";
import React from "react";

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Navbar />
      {children}
      {/* <footer>Footer</footer> */}
    </div>
  );
};

export default PublicLayout;
