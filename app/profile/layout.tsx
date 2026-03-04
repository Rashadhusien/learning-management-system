import { ROUTES } from "@/constants/routes";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";
import Navbar from "@/components/navigation/navbar";

const StudentLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  console.log(session);

  if (!session) redirect(ROUTES.LOGIN);
  return (
    <div>
      <Navbar />
      {children}
      <footer>Student Footer</footer>
    </div>
  );
};

export default StudentLayout;
