import { ROUTES } from "@/constants/routes";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";

const StudentLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  console.log(session);

  if (!session) redirect(ROUTES.LOGIN);
  return (
    <div>
      <header>Student Header</header>
      {children}
      <footer>Student Footer</footer>
    </div>
  );
};

export default StudentLayout;
